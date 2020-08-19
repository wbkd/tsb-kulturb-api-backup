module.exports = class Tag {
  constructor(db) {
    this.db = db;
  }

  count(filter) {
    return this.db.countDocuments(filter);
  }

  async find(
    filter,
    options = {
      limit: 10,
      skip: 0,
      sort: 'name',
      order: 'ascend',
      fields: [],
    }
  ) {
    const data = await this.db.find(
      filter,
      {},
      {
        limit: options.limit,
        skip: options.skip,
        sort: { [options.sort]: options.order === 'ascend' ? 1 : -1 },
        autopopulate: options.fields,
      }
    );
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
