const got = require('got');
const parser = require('fast-xml-parser');

const getOSMData = async (entry) => {
  const response = await got('https://nominatim.openstreetmap.org/search', {
    query: {
      q: entry.name,
      addressdetails: 1,
      extratags: 1,
      polygon_geojson: 1,
      format: 'json',
      city: 'Berlin',
      countrycodes: 'de',
    },
  });

  const res = JSON.parse(response.body).map(result => ({
    osmId: result.osm_id,
    osmType: result.osm_type,
    geojson: result.geojson,
    wikidataId: result.extratags.wikidata,
    accessibilityWheelchair: result.extratags.wheelchair,
    openingHours: result.extratags.opening_hours,
  })).shift();

  if (res && res.osmId) {
    try {
      const osmResponse = await got(`https://www.openstreetmap.org/api/0.6/${res.osmType}/${res.osmId}`);
      const osmData = parser.parse(osmResponse.body, {
        attributeNamePrefix: '',
        ignoreAttributes: false,
      });
      const data = Object.assign(...osmData.osm[res.osmType].tag.map(tag => ({ [tag.k]: tag.v })));

      if (data['blind:description:de'] || data['blind:description:en']) {
        res.accessibilityBlind = data['blind:description:de'] || data['blind:description:en'];
      }
      if (data['deaf:description:de'] || data['deaf:description:en']) {
        res.accessibilityDeaf = data['deaf:description:de'] || data['deaf:description:en'];
      }
    } catch (err) {
      console.log(err);
    }
  }

  return { _id: entry._id, ...res };
};

module.exports = {
  getOSMData,
};
