module.exports = class Organisation {
  constructor(db) {
    this.db = db;
  }

  async search(name, options) {
    /* return this.db.find(
      { $text: { $search: text } },
      { score: { $meta: 'textScore' } },
    ).sort({ score: { $meta: 'textScore' } }); */

    const filter = {
      name: {
        $regex: name,
        $options: 'i',
      },
    };

    const data = await this.db.find(filter)
      .limit(options.limit)
      .skip(options.skip)
      .sort({ [options.sort]: options.order === 'ascend' ? 1 : -1 });

    const count = await this.count(filter);

    return { data, count };
  }

  count(filter) {
    return this.db.countDocuments(filter);
  }

  async find(filter, options) {
    // convert array ['name', 'address', ...] to object {'name': 1, 'address': 1, ...}
    const fields = options.fields
      ? options.fields
        .map(field => ({ [field]: 1 }))
        .reduce((acc, curr) => Object.assign(acc, curr), {
          tags: 0,
          users: 0,
          images: 0,
          venues: 0,
          _id: 0,
        })
      : {};

    const data = await this.db.find(
      filter,
      fields,
      {
        limit: options.limit,
        skip: options.skip,
        sort: { [options.sort]: options.order === 'ascend' ? 1 : -1 },
        autopopulate: options.fields,
      },
    );

    const count = await this.count(filter);

    return { data, count };
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

  async update(_id, attributes) {
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
