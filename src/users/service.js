module.exports = class Service {
  constructor(db, tokenBlacklist) {
    this.db = db;
    this.tokenBlacklist = tokenBlacklist;
  }

  async search({ name, ...filters }, options) {
    const filter = {
      email: {
        $regex: name,
        $options: 'i',
      },
      ...filters,
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

  findByEmail(email) {
    return this.db.findOne({ email });
  }

  async update(_id, attributes) {
    return this.db.findByIdAndUpdate(_id, attributes, { new: true });
  }

  remove(_id) {
    return this.db.findByIdAndDelete(_id);
  }

  async create({
    email,
    password,
    organisation,
    role = 'USER',
    verified = true,
  }) {
    const user = await this.db.create({
      email,
      password,
      organisation,
      role,
      verified,
    });

    return this.db.populate(user, { path: 'organisation' });
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
