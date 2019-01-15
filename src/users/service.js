module.exports = class Service {
  constructor(db) {
    this.db = db;
  }

  create(email, password, verificationToken, verificationExpiresAt, role = 'USER') {
    return this.db.create({
      email,
      password,
      verificationToken,
      createdAt: new Date(),
      role,
    });
  }

  findOne(email, populate = '') {
    return this.db.findOne({ email })
      .lean({ autopopulate: true });
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
};
