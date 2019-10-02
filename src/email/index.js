const nodemailer = require('nodemailer');

const resetPassword = (transporter, user) => async (address, token) => {
  try {
    const mailOptions = {
      from: `"Admin" <${user}>`,
      to: address,
      subject: 'Reset your password',
      text: `Please enter this token: ${token}`,
    };

    transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
    console.error('Error sending reset password email to:', address);
  }
};

const verify = (transporter, user) => async (address, token) => {
  try {
    const mailOptions = {
      from: `"Admin" <${user}>`,
      to: address,
      subject: 'Please verify your account',
      text: `Please enter this token: ${token}`,
    };

    transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending verification email to:', address);
  }
};

const notify = (transporter, user) => async (url, address = user) => {

  try {
    const mailOptions = {
      from: `"Admin" <${user}>`,
      to: address || user,
      subject: 'New change(s) proposed',
      text: `New change(s) proposed, see them <a href="${url}">here</a>`,
    };
    transporter.sendMail(mailOptions);
    console.log(mailOptions)
  } catch (err) {
    console.error('Error sending notification email to:', address);
  }
};


const register = (server, options) => {
  const host = options.host || 'smtp.';
  const port = options.port || 587;
  const secure = options.secure || true;
  const user = options.user || 'admin@webkid.io';
  const pass = options.pass || '';

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    transporter.verify();

    server.method({ name: 'sendEmail', method: transporter.sendMail });
    server.decorate('request', 'sendVerificationEmail', verify(transporter, user));
    server.decorate('request', 'sendResetPasswordEmail', resetPassword(transporter, user));
    server.decorate('request', 'sendNotificationEmail', notify(transporter, user));
  } catch (err) {
    console.error('Error configuring the SMTP server:', host);
  }
};

exports.plugin = {
  name: 'email',
  version: '0.0.1',
  register,
  multiple: true,
};
