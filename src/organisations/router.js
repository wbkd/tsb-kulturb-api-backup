module.exports = (controller, validation) => [
  {
    method: 'GET',
    path: '/search',
    handler: controller.search,
    config: {
      validate: validation.search,
      auth: false,
      tags: ['api'],
    },
  }, {
    method: 'GET',
    path: '/',
    handler: controller.find,
    config: {
      validate: validation.find,
      auth: false,
      tags: ['api'],
    },
  }, {
    method: 'GET',
    path: '/{_id}',
    handler: controller.findById,
    config: {
      validate: validation.findById,
      auth: false,
      tags: ['api'],
    },
  }, {
    method: 'POST',
    path: '/',
    handler: controller.create,
    config: {
      validate: validation.create,
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  }, {
    method: 'PUT',
    path: '/{_id}',
    handler: controller.update,
    config: {
      validate: validation.update,
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        hapiAuthorization: { role: 'USER' },
        policies: ['isOwnOrganisation'],
      },
    },
  }, {
    method: 'DELETE',
    path: '/{_id}',
    handler: controller.remove,
    config: {
      validate: validation.remove,
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  }, {
    method: ['PUT', 'DELETE'],
    path: '/{_id}/{relation}/{relId}',
    handler: controller.handleRelation,
    config: {
      validate: validation.relation,
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        hapiAuthorization: { role: 'USER' },
      },
    },
  },
];
