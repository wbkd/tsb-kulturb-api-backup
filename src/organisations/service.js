module.exports = class Organisation {
  constructor(db) {
    this.db = db;
  }

  find(props, options) {
    const query = this.db.find(props);
    if (options.limit) query.limit(options.limit);
    if (options.skip) query.skip(options.skip);
    return query.lean();
  }

  findById(_id) {
    return this.db.findOne({ _id }).lean();
  }

  create(entry) {
    return this.db.create(entry);
  }

  update(_id, attributes) {
    return this.db.updateOne({ _id }, attributes);
  }

  remove(_id) {
    return this.db.remove({ _id });
  }

  addRelation(_id, relation, relId) {
    const res = {
      [relation]: relId,
    };

    return this.db.updateOne({ _id }, res);
  }

  removeRelation(_id, relation, relId) {
    const $pull = {
      [relation]: relId,
    };

    return this.db.updateOne({ _id }, { $pull });
  }
};
