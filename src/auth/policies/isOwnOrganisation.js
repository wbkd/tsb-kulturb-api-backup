const Boom = require('boom');

const isOwnOrganisation = async (request, h) => {
  const { _id } = request.params;
  const { _id: userId, role } = request.auth.credentials;

  if (role === 'ADMIN') return h.continue;

  const { User } = request.models;
  const user = await User.findById(userId).exec();

  if (user.organisation.toString() === _id) return h.continue;

  throw Boom.forbidden('You are not an organisation owner');
};

module.exports = isOwnOrganisation;
