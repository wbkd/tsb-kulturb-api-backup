const serializeOrganisationSchema = (entry) => {
  const res = {
    '@context': 'http://schema.org',
    '@type': 'Organisation',
    '@id': entry._id,
    name: entry.name,
    description: entry.description,
    url: entry.website,
    sameAs: entry.website,
    email: entry.email,
    telephone: entry.telephone,
  };

  const logo = entry.images.find(image => image.type === 'logo');
  if (logo) {
    res.logo = logo.url;
  }

  if (entry.address) {
    res.location = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'Germany',
        addressLocality: entry.city,
        postalCode: entry.zipcode,
        streetAddress: entry.address,
      },
    };
  }

  if (entry.location) {
    res.location.geo = {
      '@type': 'GeoCoordinates',
      latitude: entry.location.coordinates[0],
      longitude: entry.location.coordinates[1],
    };
  }

  if (entry.venues.length !== 0) {
    res.subOrganisation = entry.venues.map((venue) => {
      const result = serializeOrganisationSchema(venue);
      delete result['@context'];
      return result;
    });
  }

  return res;
};

module.exports = { serializeOrganisationSchema };
