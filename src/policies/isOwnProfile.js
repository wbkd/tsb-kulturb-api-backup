const isOwnProfile = async (request, h) => {
  const { _id } = request.params;
  const { _id: userId, role } = request.auth.credentials;

  // user is admin and can do everything
  if (role === 'ADMIN') return h.continue;

  // user is organisation member and can update it
  if (userId === _id) return h.continue;

  throw h.forbidden('You are not an organisation owner');
};

module.exports = isOwnProfile;
