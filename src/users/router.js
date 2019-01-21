module.exports = (controller, validation) => [
  {
    method: 'GET',
    path: '/',
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
      // validate: validation.login,
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
  },
];
