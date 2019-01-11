module.exports = (controller, validation) => [
  {
    method: 'GET',
    path: '/',
    handler: controller.find,
    config: {
      auth: false,
    },
  }, {
    method: 'GET',
    path: '/{_id}',
    handler: controller.findById,
    config: {
      validate: {
        params: validation.findById,
      },
      auth: false,
      plugins: {
        policies: ['json-ld'],
      },
    },
  }, {
    method: 'POST',
    path: '/',
    handler: controller.create,
    config: {
      validate: {
        payload: validation.create,
      },
      auth: 'jwt',
      plugins: {
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  }, {
    method: 'PUT',
    path: '/{_id}',
    handler: controller.update,
    config: {
      validate: {
        payload: validation.update,
      },
      auth: 'jwt',
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
      validate: {
        params: validation.remove,
      },
      auth: 'jwt',
      plugins: {
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  }, {
    method: ['PUT', 'DELETE'],
    path: '/{_id}/{relation}/{relId}',
    handler: controller.handleRelation,
    config: {
      validate: {
        params: validation.relation,
      },
      auth: 'jwt',
      plugins: {
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  },
];
