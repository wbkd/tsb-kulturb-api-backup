module.exports = (controller, validation) => [
  {
    method: 'POST',
    path: '/',
    handler: controller.create,
    config: {
      payload: {
        output: 'stream',
        allow: 'multipart/form-data',
        maxBytes: 10 * (1024 * 1024), // 10 MB
      },
      validate: validation.create,
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
      plugins: {
        hapiAuthorization: { role: 'USER' },
        policies: ['isOwnOrganisation'],
      },
    },
  },
];
