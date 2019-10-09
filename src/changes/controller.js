const { createPatch } = require('rfc6902');
const { Pointer } = require('rfc6902/pointer');
const csv = require('../utils/csv');

module.exports = class Controller {
  constructor(service) {
    this.service = service;
  }

  search(request) {
    const {
      name,
      limit = 10,
      skip = 0,
      sort = 'name',
      order = 'ascend',
      ...filters
    } = request.query;

    return this.service.search({ name, ...filters }, {
      limit,
      skip,
      sort,
      order,
    });
  }

  find(request) {
    const {
      limit = 10,
      skip = 0,
      sort = 'name',
      order = 'ascend',
      fields,
      ...filters
    } = request.query;

    return this.service.find(filters, {
      limit,
      skip,
      sort,
      order,
      fields,
    });
  }

  async findById(request, h) {
    const { _id } = request.params;

    const res = await this.service.findById(_id);
    if (!res) return h.notFound();

    return res;
  }

  create(request) {
    const { payload } = request;
    return this.service.create(payload);
  }

  async update(request, h) {
    const { _id } = request.params;
    const { payload } = request;
    const res = await this.service.update(_id, payload);

    if (!res) return h.notFound();
    return res;
  }

  async remove(request, h) {
    const { _id } = request.params;
    const res = await this.service.remove(_id);

    if (!res) return h.notFound();
    return res;
  }

  async importer(request) {
    const { file } = request.payload;
    const { schema } = this.service.db;

    const data = csv.parse(file, schema);
    return Promise.all(data.map((entry) => {
      if (entry._id) {
        return this.service.update(entry._id, entry);
      }
      return this.service.create(entry);
    }));
  }

  async exporter(request, h) {
    request.query.limit = 0;
    const { data } = await this.find(request);

    const formatted = csv.format(data);
    return h.response(formatted)
      .header('Content-type', 'text/csv')
      .header('Content-Disposition', 'attachment; filename=changeset.csv');
  }

  handleRelation(request) {
    const { _id, relation, relId } = request.params;

    if (request.method === 'put') {
      return this.service.addRelation(_id, relation, relId);
    }
    if (request.method === 'delete') {
      return this.service.removeRelation(_id, relation, relId);
    }
  }

  async diff(request) {
    const { params, server } = request;
    const { _id } = params;
    const { meta, data } = await this.service.findById(_id);
    const { organisation } = meta;
    if (organisation) {
      const orga = await server.plugins.organisations.service.findById(organisation);
      const patch = createPatch(orga.toJSON(), data.toJSON());
      const res = patch
        .filter(change => !change.path.startsWith('/_id'))
        .filter(change => !change.path.startsWith('/id'))
        .filter(change => !change.path.startsWith('/__v'));

      return res;
    }
    return [];
  }
};
