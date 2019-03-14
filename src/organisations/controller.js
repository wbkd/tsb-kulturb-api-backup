const csv = require('d3-dsv');

module.exports = class Controller {
  constructor(service) {
    this.service = service;
  }

  search(request, h) {
    const {
      name,
      limit = 10,
      skip = 0,
      sort = 'name',
      order = 'ascend',
    } = request.query;

    return this.service.search(name, {
      limit,
      skip,
      sort,
      order,
    });
  }

  find(request, h) {
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
    const { accept } = request.headers;

    const res = await this.service.findById(_id);
    if (!res) return h.notFound();

    if (accept === 'application/ld+json') {
      return h.jsonld.serializeOrganisationSchema(res);
    }

    return res;
  }

  create(request, h) {
    const { payload } = request;
    return this.service.create(payload);
  }

  async importer(request, h) {
    const { file } = request.payload;
    const { schema } = this.service.db;
    const { data: tags } = await request.server.plugins.tags.controller
      .find({ query: { limit: 0 } });

    const data = csv.csvParse(file);

    return Promise.all(data.map((entry) => {
      // convert venues, tags and types to array
      Object.keys(entry).forEach((key) => {
        // check if field is a relation
        if (Array.isArray(schema.obj[key])) {
          entry[key] = entry[key].split(',');
          if (entry[key][0] === '') entry[key] = [];
        }

        // delete field if empty
        if (!entry[key]) delete entry[key];
      });

      if (entry.location) {
        entry.location = {
          type: 'Point',
          coordinates: entry.location.split(','),
        };
      }

      if (entry.tags) {
        entry.tags = entry.tags.map(tag => tags.find(t => t.name === tag));
      }

      return entry;
    }).map((entry) => {
      if (entry._id) {
        return this.service.update(entry._id, entry);
      }
      return this.service.create(entry);
    }));
  }

  async exporter(request, h) {
    request.query.limit = 0;
    const { data } = await this.find(request);
    const formatted = csv.csvFormat(data.map(d => d._doc).map((d) => {
      d.tags = d.tags.map(t => t.name);
      d.location = d.location && d.location.coordinates;
      delete d.venues;
      return d;
    }));

    return h.response(formatted)
      .header('Content-type', 'text/csv')
      .header('Content-Disposition', 'attachment; filename=standorte.csv');
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
