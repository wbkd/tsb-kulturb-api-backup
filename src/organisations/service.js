module.exports = class Organisation {
  constructor(db) {
    this.db = db;
  }

  count(props) {
    return this.db.count(props);
  }

  find(props, options) {
    const query = this.db.find(props);
    if (options.limit) query.limit(options.limit);
    if (options.skip) query.skip(options.skip);
    if (options.sortField) query.sort({ [options.sortField]: 1 });
    if (options.sortField && options.sortOrder) {
      const sortOrder = options.sortOrder === 'ascend' ? 1 : -1;
      query.sort({ [options.sortField]: sortOrder });
    }
    return query;
  }

  findById(_id) {
    return this.db.findById(_id);
  }

  findByIdAsJSONLD(_id) {
    return this.db.serializeJSONLD(_id);
  }

  create(entry) {
    return this.db.create(entry);
  }

  update(_id, attributes) {
    return this.db.findByIdAndUpdate(_id, attributes, { new: true });
  }

  remove(_id) {
    return this.db.findByIdAndDelete(_id);
  }

  addRelation(_id, relation, relId) {
    const $push = {
      [relation]: relId,
    };

    return this.db.findByIdAndUpdate(_id, { $push }, { new: true });
  }

  removeRelation(_id, relation, relId) {
    const $pull = {
      [relation]: relId,
    };

    return this.db.findByIdAndUpdate(_id, { $pull }, { new: true });
  }
};
