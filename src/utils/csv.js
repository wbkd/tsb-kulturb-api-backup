const csv = require('d3-dsv');

const formatter = csv.dsvFormat(';');

const parse = (file, schema, tags) => {
  const data = formatter.parse(file);

  return data.map((entry) => {
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
      entry.tags = tags.filter(tag => entry.tags.find(t => t === tag.name));
    }

    return entry;
  });
};

const format = data => formatter.format(
  data.map(d => d._doc).map((d) => {
    const res = Object.assign({}, d);
    Object.keys(res).forEach((field) => {
      if (res[field].toString() === '[object Object]') {
        delete res[field];
      }
    });

    if (d.tags) {
      res.tags = d.tags.map(t => t.name);
    }

    if (d.location) {
      res.location = d.location.coordinates;
    }

    if (d.organisation) {
      res.organisation = d.organisation._id;
      res.organisation_name = d.organisation.name;
    }

    delete res.venues;
    return res;
  }),
);

module.exports = {
  parse,
  format,
};
