module.exports = class Tag {
  constructor(db) {
    this.db = db;
  }

  count(filter) {
    return this.db.countDocuments(filter);
  }

  async find(filter, fields, options = {}) {
    const data = await this.db.find(filter, {}, options);
    const count = await this.count(filter);

    return { data, count };
  }

  findById(_id) {
    return this.db.findById(_id);
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
};
