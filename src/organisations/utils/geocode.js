const got = require('got');

const geocode = async (entry) => {
  const { HERE_APP_ID, HERE_APP_CODE } = process.env;
  const response = await got('https://geocoder.api.here.com/6.2/geocode.json', {
    query: {
      app_id: HERE_APP_ID,
      app_code: HERE_APP_CODE,
      searchtext: `${entry.address}, ${entry.zipcode} ${entry.city}`,
      jsonattributes: 1,
    },
  });
  const { latitude, longitude } = JSON.parse(response.body).response.view[0].result[0].location.displayPosition;

  return {
    type: 'Point',
    coordinates: [latitude, longitude],
  };
};

module.exports = { geocode };
