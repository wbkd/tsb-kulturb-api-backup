const isOwnOrganisation = async (request, h) => {
  const { _id } = request.params;
  const { _id: userId, role } = request.auth.credentials;

  // user is admin and can do everything
  if (role === 'ADMIN') return h.continue;

  // find user
  const { User } = request.models;
  const user = await User.findById(userId);
  if (!user) throw h.notFound();
  if (!user.organisation) return h.unauthorized();

  // user is organisation member and can update it
  if (user.organisation.id === _id) return h.continue;

  // user is organisation member and can update it
  if (user.organisation.id === _id) return h.continue;

  // user is organisation member and can upload a file related to it
  if (request.path.includes('/file')) {
    if (request.method === 'post') {
      const { relation, relId } = request.payload;
      if (relation === 'organisation') {
        if (user[relation]._id.toString() === relId) return h.continue;
      } else if (relation === 'venue') {
        const match = user.organisation.venues
          .find(venue => venue._id.toString() === relId);
        if (match) return h.continue;
      }
    }
    if (request.method === 'delete') {
      const { File } = request.models;
      const file = await File.findById(_id);
      if (!file) throw h.notFound();

      if (file.organisation) {
        if (user.organisation._id.toString() === file.organisation._id.toString()) {
          return h.continue;
        }
      } else if (file.venue) {
        const match = user.organisation.venues
          .find(venue => venue._id.toString() === file.venue._id.toString());
        if (match) {
          return h.continue;
        }
      }
    }
  }

  throw h.forbidden('You are not an organisation owner');
};

module.exports = isOwnOrganisation;
