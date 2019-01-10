const owasp = require('owasp-password-strength-test');
const Boom = require('boom');

const omitCredentials = async (request, h) => {
  const { response } = request;
  if (!response.source) return response;
  if (response.source.password) {
    delete response.source.password;
    delete response.source.verificationToken;
    delete response.source.passwordResetToken;
  } else if (response.source.length) {
    response.source.forEach((res) => {
      delete res.password;
      delete res.verificationToken;
      delete res.passwordResetToken;
    });
  }
  return response;
};

const passwordStrength = async (request, h) => {
  const { password } = request.payload;
  const strength = owasp.test(password);
  if (!strength.strong) return Boom.badRequest(strength.errors);
  return h.continue;
};

module.exports = {
  omitCredentials,
  passwordStrength,
};
