const owasp = require('owasp-password-strength-test');

const omitCredentials = async (request, h) => {
  const { response } = request;
  if (!response.source) return response;
  if (response.source.password) {
    delete response.source.password;
  } else if (response.source.length) {
    response.source.forEach((res) => {
      delete res.password;
    });
  }
  return response;
};

const passwordStrength = async (request, h) => {
  const { password } = request.payload;
  const strength = owasp.test(password);
  if (!strength.strong) return h.badRequest(strength.errors);
  return h.continue;
};

module.exports = {
  omitCredentials,
  passwordStrength,
};
