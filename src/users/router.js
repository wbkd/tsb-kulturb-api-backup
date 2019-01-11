module.exports = (controller, validation) => [
  {
    method: 'GET',
    path: '/',
    handler: controller.info,
    config: {
      auth: 'jwt',
    },
  }, {
    method: 'POST',
    path: '/',
    handler: controller.signup,
    config: {
      validate: {
        payload: validation.create,
      },
      auth: false,
      plugins: {
        policies: ['passwordStrength'],
      },
    },
  }, {
    method: 'GET',
    path: '/verify',
    handler: controller.verify,
    config: {
      validate: {
        query: validation.verify,
      },
      auth: false,
    },
  }, {
    method: 'POST',
    path: '/login',
    handler: controller.login,
    config: {
      validate: {
        payload: validation.login,
      },
      auth: false,
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
    },
  }, {
    method: 'POST',
    path: '/change-password',
    handler: controller.changePassword,
    config: {
      validate: {
        payload: validation.changePassword,
      },
      auth: false,
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
      validate: {
        payload: validation.changeRole,
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
