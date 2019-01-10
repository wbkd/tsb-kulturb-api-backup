const renderJSONLD = async (request, h) => {
  if (request.headers.accept === 'application/ld+json') {
    if (request.response.source) {
      const {
        _id: id,
        __v,
        users,
        ...props
      } = request.response.source;

      const { path } = request;
      let type;
      if (path.startsWith('/organisation')) {
        type = 'Organisation';
      } else if (path.startsWith('/location')) {
        type = 'Place';
      }
      request.response.source = {
        '@context': 'http://schema.org',
        '@type': type,
        '@id': id,
        ...props,
      };
    }
  }

  return h.continue;
};

renderJSONLD.applyPoint = 'onPreResponse';

const register = async (server, options) => {
  server.plugins.mrhorse.addPolicy('json-ld', renderJSONLD);
};

exports.plugin = {
  name: 'json-ld',
  version: '0.0.1',
  register,
  dependencies: ['mrhorse'],
};
