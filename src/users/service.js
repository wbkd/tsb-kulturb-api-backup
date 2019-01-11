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
      .populate(populate)
      .lean();
  }

  update(instance, attributes) {
    return this.db.updateOne(instance, attributes);
  }

  addRelation(_id, relation, relId) {
    const res = {
      [relation]: relId,
    };

    return this.db.updateOne({ _id }, res);
  }

  async removeRelation(_id, relation, relId) {
    const $unset = {
      [relation]: relId,
    };

    return this.db.updateOne({ _id }, { $unset });
  }
};
