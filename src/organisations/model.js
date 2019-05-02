const geocoder = require('./utils/geocode');
const osm = require('./utils/osm');

module.exports = (mongoose) => {
  const { Schema } = mongoose;

  const accessibilitySchema = {
    deaf: {
      subtitles: { type: Boolean },
      signLanguage: { type: Boolean },
      hearingAid: { type: Boolean },
      description: { type: String },
    },
    blind: {
      braille: { type: Boolean },
      guidance: { type: Boolean },
      audioguide: { type: Boolean },
      description: { type: String },
    },
    wheelchair: {
      accessible: {
        type: String,
        enum: [
          'yes',
          'no',
          'limited',
          'unknown',
        ],
      },
      toilets: { type: Boolean },
      description: { type: String },
    },
  };

  const transportationSchema = {
    tram: { type: String },
    bus: { type: String },
    subway: { type: String },
    railway: { type: String },
  };

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
    published: { type: Boolean, default: false },
    website: { type: String },
    email: { type: String },
    telephone: { type: String },
    address: { type: String },
    zipcode: { type: String },
    city: { type: String },
    location: { type: pointSchema },
    funded: { type: Boolean },
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
    accessibility: { type: accessibilitySchema },
    transportation: { type: transportationSchema },
    openingHours: {
      type: String,
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

  Organisation.virtual('teaser', {
    ref: 'File',
    localField: '_id',
    foreignField: 'location',
    justOne: true,
    autopopulate: {
      match: { type: 'teaser' },
      maxDepth: 1,
    },
  });

  const getFullAddress = doc => [doc.address, doc.zipcode, doc.city].join(' ');

  Organisation.method('fullAddress', function () {
    return getFullAddress(this);
  });

  // workaround for https://github.com/Automattic/mongoose/issues/964
  Organisation.pre('findOneAndUpdate', async function geocode() {
    const doc = await this.model.findById(this._conditions._id);
    if (
      doc
        && this._update.address && this._update.zipcode && this._update.city
        && (doc.fullAddress() !== getFullAddress(this._update))
    ) {
      try {
        this._update.location = await geocoder.geocode(this._update);
      } catch (err) {
        this._update.location = undefined;
        console.log('Error geocoding:', err);
      }
    }
  });

  Organisation.pre('save', async function geocode(next) {
    if (this.address && this.zipcode && this.city) {
      this.location = await geocoder.geocode(this);
    }

    next();
  });

  Organisation.pre('save', async function importOSMData(next) {
    try {
      const {
        accessibilityWheelchair,
        accessibilityBlind,
        accessibilityDeaf,
        openingHours,
      } = await osm.getOSMData(this);

      if (accessibilityWheelchair && !this.accessibility.wheelchair.accessible) {
        this.accessibility.wheelchair.accessible = accessibilityWheelchair;
      }

      if (accessibilityBlind && !this.accessibility.blind.description) {
        this.accessibility.blind.description = accessibilityBlind;
      }

      if (accessibilityDeaf && !this.accessibility.deaf.description) {
        this.accessibility.deaf.description = accessibilityDeaf;
      }

      if (openingHours && !this.openingHours) this.openingHours = openingHours;
    } catch (err) {
      console.log(err);
    }

    next();
  });

  return mongoose.model('Organisation', Organisation);
};
