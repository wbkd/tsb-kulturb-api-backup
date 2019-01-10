const router = require('./router');
const Service = require('./service');
const Controller = require('./controller');
const hooks = require('./hooks');
const model = require('./model');
const validation = require('./validation');

const register = (server, options) => {

  // init service
  const service = new Service(model);

  // init controller
  const controller = new Controller(service);
  server.bind(controller);

  // init router
  const routes = router(controller, validation);
  routes.forEach(route => server.route(route));

  // hooks
  server.ext('onPreResponse', hooks.omitCredentials, { sandbox: 'plugin' });
  server.plugins.mrhorse.addPolicy('passwordStrength', hooks.passwordStrength);

  server.expose('service', service);
};

exports.plugin = {
  name: 'user',
  version: '0.0.1',
  register,
  dependencies: ['auth', 'email'],
};
