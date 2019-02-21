module.exports = class Controller {
  constructor(service) {
    this.service = service;
  }

  async find(request, h) {
    const {
      limit = 10,
      skip = 0,
      sort = 'name',
      order = 'ascend',
      ...filters
    } = request.query;

    const data = await this.service.find(filters, {
      limit,
      skip,
      sort,
      order,
    });

    const count = await this.service.count(filters);
    return { data, count };
  }

  findById(request, h) {
    const { _id } = request.params;
    const { accept } = request.headers;
    if (accept === 'application/ld+json') {
      return this.service.findByIdAsJSONLD(_id);
    }
    return this.service.findById(_id);
  }

  create(request, h) {
    const { payload } = request;
    return this.service.create(payload);
  }

  update(request, h) {
    const { _id } = request.params;
    const { payload } = request;
    return this.service.update(_id, { $set: payload });
  }

  remove(request, h) {
    const { _id } = request.params;
    return this.service.remove(_id);
  }

  handleRelation(request, h) {
    const { _id, relation, relId } = request.params;

    if (request.method === 'put') {
      return this.service.addRelation(_id, relation, relId);
    }
    if (request.method === 'delete') {
      return this.service.removeRelation(_id, relation, relId);
    }
  }
};
