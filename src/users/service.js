module.exports = class Service {
  constructor(model) {
    this.model = model;
  }

  create(email, password, verificationToken, verificationExpiresAt, role = 'USER') {
    return this.model.create({
      email,
      password,
      verificationToken,
      createdAt: new Date(),
      role,
    });
  }

  findOne(email, populate = '') {
    return this.model.findOne({ email })
      .populate(populate)
      .lean();
  }

  update(instance, attributes) {
    return this.model.updateOne(instance, attributes);
  }

  addRelation(_id, relation, relId) {
    const res = {
      [relation]: relId,
    };

    return this.model.updateOne({ _id }, res);
  }
};
