const jsonld = require('./serialize');

const register = (server, options) => {
  server.decorate('toolkit', 'jsonld', jsonld);
};

exports.plugin = {
  name: 'json-ld',
  version: '0.0.1',
  register,
};
