const bcrypt = require('bcrypt');

module.exports = (mongoose) => {
  const { Schema, model } = mongoose;

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
    organisation: { type: Schema.Types.ObjectId, ref: 'Organisation', autopopulate: true },
  });

  User.pre('validate', (user) => {
    // only hash the password if it has been modified (or is new)
    if (user.isModified('password')) {
      // hash password and salt hash
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
    }

    if (user.isModified('verificationToken')) {
      // hash password and salt hash
      user.verificationToken = bcrypt.hashSync(user.verificationToken, bcrypt.genSaltSync(8));
    }

    if (user.isModified('passwordResetToken')) {
      // hash password and salt hash
      user.passwordResetToken = bcrypt.hashSync(user.passwordResetToken, bcrypt.genSaltSync(8));
    }
  });

  User.methods.compareToken = doc => (token, field) => bcrypt.compare(token, doc[field]);

  return model('User', User);
};
