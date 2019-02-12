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
  });

  const Organisation = new Schema({
    name: { type: String, required: true, index: { unique: true } },
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
    type: {
      type: String,
      enum: [
        'organisation',
        'venue',
        'organisation and venue',
      ],
    },
  }, { toJSON: { virtuals: true } });

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

  Organisation.pre('save', function (next) {
    const organisation = this;

    if (organisation.address && (organisation.isModified('address') || organisation.isModified('city') || organisation.isModified('zipcode'))) {
      console.log('georeference');
    }

    next();
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

  return mongoose.model('Organisation', Organisation);
};
