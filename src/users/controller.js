const bcrypt = require('bcrypt');
const crypto = require('crypto');

const generateToken = (bytes = 16) => crypto.randomBytes(bytes).toString('hex');
const hashToken = (token, salt = 8) => bcrypt.hashSync(token, bcrypt.genSaltSync(salt));
const compareToken = (hashedToken, token) => bcrypt.compare(hashedToken, token);
const calculateExpiration = (d = new Date(), offset = 24 * 60 * 60 * 1000) => d.setTime(d.getTime() + (offset));

module.exports = class Controller {
  constructor(service) {
    this.service = service;
  }

  async signup(request, h) {
    const { email, password } = request.payload;

    try {
      const user = await this.service.findOne(email);
      if (user) return h.badRequest('Already Registered');

      const hash = hashToken(password);
      const verificationToken = generateToken();

      request.sendVerificationEmail(email, verificationToken);

      // @TODO: the verification token should expires
      const hashedToken = hashToken(verificationToken);
      const verificationExpiresAt = calculateExpiration();
      await this.service.create({
        email,
        password: hash,
        verificationToken: hashedToken,
        verificationExpiresAt,
      });

      return { success: true };
    } catch (err) {
      console.error(err);
      return h.badImplementation();
    }
  }

  async resendConfirmationEmail(request, h) {
    const { email } = request.payload;

    try {
      const user = await this.service.findOne(email);
      if (!user) return h.unauthorized();
      if (!user.verificationToken) return h.badRequest();

      const verificationExpiresAt = calculateExpiration();
      await this.service.update({ email }, { $set: { verificationExpiresAt } });
      request.sendVerificationEmail(email, user.verificationToken);
      return { success: true };
    } catch (err) {
      console.error(err);
      return h.badImplementation();
    }
  }

  async verify(request, h) {
    const { email, token } = request.query;

    try {
      const user = await this.service.findOne(email);
      if (!user) return h.unauthorized();

      if (new Date(user.verificationExpiresAt) < new Date()) return h.unauthorized();

      const isValid = await compareToken(token, user.verificationToken);
      if (!isValid) return h.unauthorized();

      await this.service.update({ email }, { $unset: { verificationToken: 1 } });

      return { success: true };
    } catch (err) {
      console.error(err);
      return h.badImplementation();
    }
  }

  async login(request, h) {
    const { email, password } = request.payload;

    try {
      const user = await this.service.findOne(email);
      if (!user) return h.unauthorized();

      if (user.verificationToken) return h.unauthorized('Please confirm your email address');

      const isValid = await compareToken(password, user.password);
      if (!isValid) return h.unauthorized();

      const { _id, role } = user;
      const token = request.generateToken(_id, email, role);
      return {
        _id,
        role,
        email,
        token,
      };
    } catch (err) {
      console.error(err);
      return h.badImplementation();
    }
  }

  async passwordReset(request, h) {
    const { email } = request.payload;

    try {
      const user = await this.service.findOne(email);
      if (!user) return h.unauthorized();

      const passwordResetToken = generateToken();
      const resetTokenExpiresAt = calculateExpiration();
      console.log(passwordResetToken);
      request.sendResetPasswordEmail(email, passwordResetToken);

      const encryptedResetToken = hashToken(passwordResetToken);
      await this.service.update(
        { email },
        { $set: { passwordResetToken: encryptedResetToken, resetTokenExpiresAt } },
      );

      return { success: true };
    } catch (err) {
      console.error(err);
      return h.badImplementation();
    }
  }

  async changePassword(request, h) {
    const { email, token, password } = request.payload;

    try {
      const user = await this.service.findOne(email);
      if (!user) return h.unauthorized();

      if (!user.passwordResetToken) return h.unauthorized();
      if (new Date(user.resetTokenExpiresAt) < new Date()) return h.unauthorized();

      const isValid = await compareToken(token, user.passwordResetToken);
      if (!isValid) return h.unauthorized();

      const hash = hashToken(password);
      await this.service.update(
        { email },
        { $unset: { passwordResetToken: 1, resetTokenExpiresAt: 1 }, $set: { password: hash } },
      );

      return { success: true };
    } catch (err) {
      console.error(err);
      return h.badImplementation();
    }
  }

  changeRole(request, h) {
    const { email, role } = request.payload;

    try {
      return this.service.update({ email }, { $set: { role } });
    } catch (err) {
      console.error(err);
      return h.badImplementation();
    }
  }

  info(request, h) {
    const { email } = request.auth.credentials;
    const { populate } = request.query;
    return this.service.findOne(email, populate);
  }

  handleRelation(request, h) {
    const { _id, relation, relId } = request.params;

    if (request.method === 'put') {
      return this.service.addRelation(_id, relation, relId);
    }
    if (request.method === 'delete') {
      return this.service.removeRelation(_id, relation, relId);
    }
  }
};
