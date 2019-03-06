const geocoder = require('./utils/geocode');

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
  }, { timestamps: true, toJSON: { virtuals: true } });

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

  Organisation.virtual('logo', {
    ref: 'File',
    localField: '_id',
    foreignField: 'location',
    justOne: true,
    autopopulate: {
      match: { type: 'logo' },
      maxDepth: 1,
    },
  });

  Organisation.virtual('images', {
    ref: 'File',
    localField: '_id',
    foreignField: 'location',
    autopopulate: {
      maxDepth: 1,
    },
  });

  Organisation.pre('save', async function geocode(next) {
    const organisation = this;

    if (organisation.address && (organisation.isModified('address') || organisation.isModified('city') || organisation.isModified('zipcode'))) {
      organisation.location = await geocoder.geocode(organisation);
    }

    next();
  });

  return mongoose.model('Organisation', Organisation);
};
