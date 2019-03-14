const bcrypt = require('bcrypt');

module.exports = (mongoose) => {
  const { Schema, model } = mongoose;

  const User = new Schema({
    firstname: { type: String },
    lastname: { type: String },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: { unique: true },
    },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date },
    role: { type: String, enum: ['ADMIN', 'USER'] },
    organisation: { type: Schema.Types.ObjectId, ref: 'Organisation', autopopulate: true },
  }, { timestamps: true, toJSON: { virtuals: true } });

  User.pre('save', function hashPassword(next) {
    const user = this;

    if (user.password && user.isModified('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
    }

    next();
  });

  User.methods.comparePassword = async function comparePassword(password) {
    return bcrypt.compare(password, this.password);
  };

  const Token = new Schema({
    token: { type: String },
  }, { timestamps: true });

  return {
    User: model('User', User),
    Token: model('Token', Token),
  };
};
