module.exports = class Controller {
  constructor(service) {
    this.service = service;
  }

  find(request, h) {
    const {
      limit = 10,
      skip = 0,
      sort = 'name',
      order = 'ascend',
      ...filters
    } = request.query;

    return this.service.find(filters, {
      limit,
      skip,
      sort,
      order,
    });
  }

  findById(request, h) {
    const { _id } = request.params;
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
};
