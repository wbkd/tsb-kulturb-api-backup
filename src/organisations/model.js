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

const Organisation = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  description: { type: String },
  website: { type: String },
  email: { type: String },
  telephone: { type: String },
  address: { type: String },
  zipcode: { type: Number },
  city: { type: String },
  location: { type: pointSchema },
  venues: [{
    type: Schema.Types.ObjectId,
    ref: 'Venue',
    autopopulate: true,
    unique: true,
  }],
}, { toJSON: { virtuals: true } });

Organisation.index({ location: '2dsphere' });

Organisation.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'organisation',
  autopopulate: {
    maxDepth: 1,
    select: '-password -verificationToken -passwordResetToken -resetTokenExpiresAt -verificationTokenExpiresAt',
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

async function serializeJSONLD(_id) {
  const entry = await this.model('Organisation').findById(_id).lean({ autopopulate: true });
  const res = {
    '@context': 'http://schema.org',
    '@type': 'Organisation',
    '@id': entry._id,
    name: entry.name,
    description: entry.description,
    website: entry.website,
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
        addressLocality: entry.city,
        postalCode: entry.zipcode,
        streetAddress: entry.address,
      },
    };
  }

  return res;
}

Organisation.statics.serializeJSONLD = serializeJSONLD;

module.exports = mongoose.model('Organisation', Organisation);
