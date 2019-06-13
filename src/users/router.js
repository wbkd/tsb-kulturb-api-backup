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
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  }, {
    method: 'GET',
    path: '/{_id}',
    handler: controller.findById,
    config: {
      validate: validation.findById,
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
        policies: ['isOwnProfile', 'passwordStrength'],
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
    method: 'GET',
    path: '/me',
    handler: controller.info,
    config: {
      auth: 'jwt',
      tags: ['api'],
    },
  }, {
    method: 'POST',
    path: '/',
    handler: controller.signup,
    config: {
      validate: validation.create,
      auth: false,
      tags: ['api'],
      plugins: {
        policies: ['passwordStrength'],
      },
    },
  }, {
    method: 'GET',
    path: '/verify',
    handler: controller.verify,
    config: {
      validate: validation.verify,
      auth: false,
      tags: ['api'],
    },
  }, {
    method: 'POST',
    path: '/login',
    handler: controller.login,
    config: {
      validate: validation.login,
      auth: false,
      tags: ['api'],
      plugins: {
        'hapi-rate-limitor': {
          max: 10,
          duration: 5 * 60 * 1000,
          enabled: true,
        },
      },
    },
  }, {
    method: 'GET',
    path: '/refreshToken',
    handler: controller.refreshToken,
    config: {
      validate: validation.refreshToken,
      auth: false,
      tags: ['api'],
      plugins: {
        'hapi-rate-limitor': {
          max: 10,
          duration: 5 * 60 * 1000,
          enabled: true,
        },
      },
    },
  }, {
    method: 'POST',
    path: '/resend-confirmation-email',
    handler: controller.resendConfirmationEmail,
    config: {
      validate: {
        payload: { email: validation.email },
      },
      auth: false,
      tags: ['api'],
    },
  }, {
    method: 'POST',
    path: '/reset-password',
    handler: controller.passwordReset,
    config: {
      validate: {
        payload: { email: validation.email },
      },
      auth: false,
      tags: ['api'],
    },
  }, {
    method: 'POST',
    path: '/change-password',
    handler: controller.changePassword,
    config: {
      validate: validation.changePassword,
      auth: false,
      tags: ['api'],
      plugins: {
        'hapi-rate-limitor': {
          max: 10,
          duration: 5 * 60 * 1000,
          enabled: true,
        },
        policies: ['passwordStrength'],
      },
    },
  }, {
    method: 'POST',
    path: '/change-role',
    handler: controller.changeRole,
    config: {
      // validate: validation.changeRole,
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
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  }, {
    method: 'POST',
    path: '/import',
    handler: controller.importer,
    config: {
      validate: validation.importer,
      auth: 'jwt',
      tags: ['api'],
      plugins: {
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  }, {
    method: 'GET',
    path: '/export',
    handler: controller.exporter,
    config: {
      validate: validation.exporter,
      tags: ['api'],
      plugins: {
        hapiAuthorization: { role: 'ADMIN' },
      },
    },
  },
];
