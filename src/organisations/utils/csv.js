const csv = require('d3-dsv');

const parse = (file, schema, tags) => {
  const data = csv.csvParse(file);

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

const format = data => csv.csvFormat(
  data.map(d => d._doc).map((d) => {
    d.tags = d.tags.map(t => t.name);
    d.location = d.location && d.location.coordinates;
    delete d.venues;
    return d;
  }),
);

module.exports = {
  parse,
  format,
};
