const got = require('got');
const Boom = require('boom');

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

module.exports = (mongoose) => {
  const { Schema } = mongoose;

  const pointSchema = new Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  }, { _id: false });

  const Organisation = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    website: { type: String },
    email: { type: String },
    telephone: { type: String },
    address: { type: String },
    zipcode: { type: String },
    city: { type: String },
    location: { type: pointSchema },
    venues: [{
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
      autopopulate: true,
    }],
    tags: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      autopopulate: true,
    }],
    accessibility: {
      type: String,
      enum: [
        'full',
        'partially',
        'none',
        'unknown',
      ],
    },
    types: [{
      type: String,
      enum: [
        'organisation',
        'venue',
        'organisation and venue',
      ],
    }],
  }, { toJSON: { virtuals: true } });

  Organisation.index({
    name: 'text',
    description: 'text',
    website: 'text',
    address: 'text',
    city: 'text',
  });

  Organisation.index({ location: '2dsphere' });

  Organisation.virtual('users', {
    ref: 'User',
    localField: '_id',
    foreignField: 'organisation',
    autopopulate: {
      maxDepth: 1,
      select: '-password',
    },
  });

  Organisation.virtual('images', {
    ref: 'File',
    localField: '_id',
    foreignField: 'organisation',
    autopopulate: {
      maxDepth: 1,
    },
  });

  Organisation.pre('save', async function geocode(next) {
    const organisation = this;

    if (organisation.address && (organisation.isModified('address') || organisation.isModified('city') || organisation.isModified('zipcode'))) {
      const { HERE_APP_ID, HERE_APP_CODE } = process.env;
      const response = await got('https://geocoder.api.here.com/6.2/geocode.json', {
        query: {
          app_id: HERE_APP_ID,
          app_code: HERE_APP_CODE,
          searchtext: `${organisation.address}, ${organisation.zipcode} ${organisation.city}`,
          jsonattributes: 1,
        },
      });
      const { latitude, longitude } = JSON.parse(response.body).response.view[0].result[0].location.displayPosition;

      organisation.location = {
        type: 'Point',
        coordinates: [latitude, longitude],
      };

      next();
    }
  });

  Organisation.statics.serializeJSONLD = async function serializeJSONLD(_id) {
    try {
      const entry = await this.model('Organisation').findById(_id);
      return serializeOrganisationSchema(entry);
    } catch (err) {
      return Boom.notFound();
    }
  };

  return mongoose.model('Organisation', Organisation);
};
