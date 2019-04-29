const zxcvbn = require('zxcvbn');
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
  const strength = zxcvbn(password);
  if (strength.score < 4) return h.badRequest(strength.feedback.warning);
  return h.continue;
};

module.exports = {
  omitCredentials,
  passwordStrength,
};
