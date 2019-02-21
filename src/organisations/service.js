module.exports = class Organisation {
  constructor(db) {
    this.db = db;
  }

  search(text) {
    return this.db.find(
      { $text: { $search: text } },
      { score: { $meta: 'textScore' } },
    ).sort({ score: { $meta: 'textScore' } });
  }

  count(props) {
    return this.db.count(props);
  }

  find(props, options) {
    return this.db.find(props)
      .limit(options.limit)
      .skip(options.skip)
      .sort({ [options.sort]: options.order === 'ascend' ? 1 : -1 });
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
