const path = require('path');
const MrHorse = require('mrhorse');
const Jwt = require('jsonwebtoken');
const HapiAuthJWT = require('hapi-auth-jwt2');
const HapiAuthorization = require('hapi-authorization');

const router = require('./router');
const Service = require('./service');
const Controller = require('./controller');
const hooks = require('./hooks');
const model = require('./model');
const validation = require('./validation');

const validate = async (db, decoded, request) => {
  const { _id } = decoded;
  const user = await db.findById({ _id });
  if (!user) {
    return { isValid: false };
  }

  if (user.blocked) {
    return { isValid: false };
  }

  return { isValid: true };
};

const generateToken = (key, expiresIn) => (_id, email, role) => Jwt.sign({ _id, email, role }, key, { expiresIn });

const register = async (server, options) => {
  const key = options.secret || 'NeverShareYourSecret';
  const expiresIn = options.expiresIn || '1d';

  // register auth-related plugins
  await server.register({ plugin: HapiAuthJWT });
  await server.register({ plugin: HapiAuthorization, options: { hierarchy: true } });
  await server.register({
    plugin: MrHorse,
    options: { policyDirectory: path.join(__dirname, '..', 'policies') },
  });

  // register model
  const User = model(server.mongoose);

  // add JWT strategy
  server.auth.strategy('jwt', 'jwt', {
    key,
    validate: (decoded, request) => validate(User, decoded, request),
    verifyOptions: { algorithms: ['HS256'] },
  });

  // enable JWT by default
  server.auth.default('jwt');
  server.decorate('request', 'generateToken', generateToken(key, expiresIn));
  server.decorate('request', 'verifyToken', token => Jwt.verify(token, key));

  // init service
  const service = new Service(User);

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

  // create default admin
  if (options.admin) {
    const { email, password } = options.admin;
    if (email && password) {
      try {
        await service.create({
          email,
          password,
          role: 'ADMIN',
        });
      } catch (err) {
        console.log('Admin already exists');
      }
    }
  }
};

exports.plugin = {
  name: 'users',
  version: '0.0.1',
  register,
  dependencies: ['email'],
};
