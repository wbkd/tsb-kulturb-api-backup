const bcrypt = require('bcrypt');

module.exports = (mongoose) => {
  const { Schema, model } = mongoose;

  const User = new Schema({
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true, select: false },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date },
    role: { type: String, enum: ['ADMIN', 'USER'] },
    organisation: { type: Schema.Types.ObjectId, ref: 'Organisation', autopopulate: true },
  });

  User.pre('save', function (next) {
    const user = this;

    if (user.password && user.isModified('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
    }

    next();
  });

  User.methods.comparePassword = doc => token => bcrypt.compare(token, doc.password);

  return model('User', User);
};
