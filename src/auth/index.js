const path = require('path');
const Jwt = require('jsonwebtoken');
const HapiAuthJWT = require('hapi-auth-jwt2');
const HapiAuthorization = require('hapi-authorization');
const MrHorse = require('mrhorse');

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
  const model = options.model || 'User';
  const key = options.secret || 'NeverShareYourSecret';
  const expiresIn = options.expiresIn || '1d';
  const policies = options.policies || '/policies';

  const db = server.mongoose.model(model);

  await server.register({ plugin: HapiAuthJWT });

  await server.register({ plugin: HapiAuthorization, options: { hierarchy: true } });

  await server.register({
    plugin: MrHorse,
    options: { policyDirectory: path.join(__dirname, policies) },
  });

  server.auth.strategy('jwt', 'jwt', {
    key,
    validate: (decoded, request) => validate(db, decoded, request),
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.default('jwt');
  server.decorate('request', 'generateToken', generateToken(key, expiresIn));
};

exports.plugin = {
  name: 'auth',
  version: '0.0.1',
  dependencies: ['db'],
  register,
};
