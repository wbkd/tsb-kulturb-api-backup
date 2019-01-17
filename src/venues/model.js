const mongoose = require('mongoose');

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
});

const Venue = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  description: { type: String },
  website: { type: String },
  email: { type: String },
  telephone: { type: String },
  openingHours: { type: String },
  maximumAttendeeCapacity: { type: Number },
  address: { type: Date },
  zipcode: { type: Number },
  city: { type: String },
  location: { type: pointSchema },
}, { toJSON: { virtuals: true } });

Venue.index({ location: '2dsphere' });

Venue.virtual('images', {
  ref: 'File',
  localField: '_id',
  foreignField: 'venue',
  autopopulate: {
    maxDepth: 1,
  },
});

Venue.virtual('organisations', {
  ref: 'Organisation',
  localField: '_id',
  foreignField: 'venues',
  autopopulate: {
    maxDepth: 1,
  },
});

async function serializeJSONLD(_id) {
  const entry = await this.model('Venue').findById(_id).lean({ autopopulate: true });
  const res = {
    '@context': 'http://schema.org',
    '@type': 'Place',
    '@id': entry._id,
    name: entry.name,
    description: entry.description,
    website: entry.website,
    sameAs: entry.website,
    email: entry.email,
    telephone: entry.telephone,
    maximumAttendeeCapacity: entry.maximumAttendeeCapacity,
  };

  // @TODO: serialize openingHours

  const logo = entry.images.find(image => image.type === 'logo');
  if (logo) {
    res.logo = logo.url;
  }

  if (entry.address) {
    res.location = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: entry.city,
        postalCode: entry.zipcode,
        streetAddress: entry.address,
      },
    };
  }

  return res;
}

Venue.statics.serializeJSONLD = serializeJSONLD;

module.exports = mongoose.model('Venue', Venue);
