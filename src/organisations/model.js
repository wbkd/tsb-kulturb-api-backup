const mongoose = require('mongoose');

const { Schema } = mongoose;

const Organisation = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  description: { type: String },
  website: { type: String },
  email: { type: String },
  telephone: { type: String },
  address: { type: Date },
  zipcode: { type: Number },
  city: { type: String },
  // location
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Organisation', Organisation);
