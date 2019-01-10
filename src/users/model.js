const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  verificationToken: { type: String },
  passwordResetToken: { type: String },
  resetTokenExpiresAt: { type: Date },
  createdAt: { type: Date },
  role: { type: String, enum: ['ADMIN', 'USER'] },
  organisation: { type: Schema.Types.ObjectId, ref: 'Organisation' },
});

module.exports = mongoose.model('User', User);
