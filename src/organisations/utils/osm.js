const got = require('got');

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

  return JSON.parse(response.body).map(result => ({
    osmId: result.place_id,
    geojson: result.geojson,
    wikidataId: result.extratags.wikidata,
    accessibility: result.extratags.wheelchair,
    openingHours: result.extratags.opening_hours,
  })).shift();
};

module.exports = {
  getOSMData,
};
