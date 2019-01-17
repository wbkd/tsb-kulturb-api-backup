const mongoose = require('mongoose');

const { Schema } = mongoose;

const File = new Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  type: {
    type: String,
    enum: ['logo', 'image'],
    required: true,
  },
}, { discriminatorKey: 'relation', timestamps: true });

const model = mongoose.model('File', File);

model.discriminator('organisation',
  new Schema({
    organisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
    },
  }));

model.discriminator('venue',
  new Schema({
    venue: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
    },
  }));

module.exports = model;
