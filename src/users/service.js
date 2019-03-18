module.exports = class Service {
  constructor(db, tokenBlacklist) {
    this.db = db;
    this.tokenBlacklist = tokenBlacklist;
  }

  create({
    email,
    password,
    role = 'USER',
    verified = false,
  }) {
    return this.db.create({
      email,
      password,
      role,
      verified,
    });
  }

  findOne(email) {
    return this.db.findOne({ email });
  }

  update(instance, attributes) {
    return this.db.findOneAndUpdate(instance, attributes, { new: true });
  }

  addRelation(_id, relation, relId) {
    const res = {
      [relation]: relId,
    };

    return this.db.findByIdAndUpdate(_id, res, { new: true });
  }

  removeRelation(_id, relation, relId) {
    const $unset = {
      [relation]: relId,
    };

    return this.db.findByIdAndUpdate(_id, { $unset }, { new: true });
  }

  addToBlacklist(token) {
    return this.tokenBlacklist.create({ token });
  }

  checkBlacklist(token) {
    return this.tokenBlacklist.findOne({ token });
  }
};
