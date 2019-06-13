const router = require('./router');
const Service = require('./service');
const Controller = require('./controller');
const model = require('./model');
const validation = require('./validation');

const register = (server, options) => {
  // init model
  const Organisation = model(server.mongoose);

  // init service
  const service = new Service(Organisation);

  // init controller
  const controller = new Controller(service);
  server.bind(controller);

  // init router
  const routes = router(controller, validation);
  routes.forEach(route => server.route(route));

  server.expose('service', service);
  server.expose('controller', controller);
};

exports.plugin = {
  name: 'organisations',
  version: '0.0.1',
  register,
};
