const owasp = require('owasp-password-strength-test');
const Redactyl = require('redactyl.js');

const redactyl = new Redactyl({
  properties: ['password'],
});

redactyl.setText('');

const omitCredentials = async (request, h) => {
  const { response } = request;
  if (!response.source) return response;
  if (typeof response.source === 'object' && !Array.isArray(response.source)) {
    return redactyl.redact(response.source);
  }
  return response;
};

const passwordStrength = async (request, h) => {
  const { password } = request.payload;
  if (password) {
    /*
    const strength = owasp.test(password);
    if (!strength.strong) return h.badRequest(strength.errors);
    */
    if (password.length < 8) return h.badRequest('Password must be at least 8 characters');
  }
  return h.continue;
};

module.exports = {
  omitCredentials,
  passwordStrength,
};
