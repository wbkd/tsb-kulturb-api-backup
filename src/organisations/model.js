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
}, { toJSON: { virtuals: true } });

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

module.exports = mongoose.model('Organisation', Organisation);
