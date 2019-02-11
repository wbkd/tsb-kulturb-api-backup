const router = require('./router');
const Service = require('./service');
const Controller = require('./controller');
const model = require('./model');
const validation = require('./validation');

const register = async (server, options) => {
  const tags = options.tags || [];

  // register model
  const Tag = model(server.mongoose);

  // init service
  const service = new Service(Tag);

  // init controller
  const controller = new Controller(service);
  server.bind(controller);

  // init router
  const routes = router(controller, validation);
  routes.forEach(route => server.route(route));

  server.expose('service', service);

  // create tags
  for (const tag of tags) {
    try {
      await Tag.create({ name: tag });
    } catch (err) {
      if (err.name !== 'ValidationError' && err.errors.name.kind !== 'unique')
        console.log(err);
    }
  }
};

exports.plugin = {
  name: 'tags',
  version: '0.0.1',
  register,
};
