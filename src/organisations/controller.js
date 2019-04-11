const Bottleneck = require('bottleneck');
const csv = require('./utils/csv');
const osm = require('./utils/osm');

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

  async getOSMData(request, h) {
    request.query.limit = 0;
    const { data: entries } = await this.find(request);

    const limiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: 2000,
    });

    const results = await limiter.schedule(() => {
      const promises = entries.map(entry => osm.getOSMData(entry));
      return Promise.all(promises);
    });

    results.map((result) => {
      if (result) {
        if (Object.keys(result) === ['_id']) return;

        const {
          accessibilityWheelchair,
          accessibilityBlind,
          accessibilityDeaf,
          openingHours,
          _id,
        } = result;

        const accessibility = {};
        if (accessibilityWheelchair || accessibilityBlind || accessibilityDeaf) {
          if (accessibilityWheelchair) {
            accessibility.wheelchair = { accessible: accessibilityWheelchair };
          }
          if (accessibilityBlind) accessibility.blind = { description: accessibilityBlind };
          if (accessibilityDeaf) accessibility.deaf = { description: accessibilityDeaf };
        }

        let res = {};
        if (openingHours) res = { openingHours };
        if (Object.entries(accessibility).length) {
          res.accessibility = accessibility;
        }

        return this.service.update(_id, res);
      }
    });

    return { running: true };
  }

  async importer(request, h) {
    const { file } = request.payload;
    const { schema } = this.service.db;
    const { data: tags } = await request.server.plugins.tags.controller
      .find({ query: { limit: 0 } });

    const data = csv.parse(file, schema, tags);
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
      .header('Content-Disposition', 'attachment; filename=kulturorte.csv');
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
