const owasp = require('owasp-password-strength-test');
const Redactyl = require('redactyl.js');

const redactyl = new Redactyl({
  properties: ['password'],
});

redactyl.setText('');

const omitCredentials = async (request, h) => {
  const { response } = request;
  if (!response.source) return response;
  return redactyl.redact(response.source);
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
