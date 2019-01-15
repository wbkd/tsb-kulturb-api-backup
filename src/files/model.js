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
  organisation: {
    type: Schema.Types.ObjectId,
    ref: 'Organisation',
    autopopulate: true,
    required: true,
  },
});

module.exports = mongoose.model('File', File);
