const sendNotification = async (request, h) => {
  const { info, response } = request;
  const { referrer } = info;
  const { _id, meta } = response.source;
  const { organisation, email } = meta;

  const type = organisation ? 'korrekturen' : 'einreichungen';

  const url = referrer.replace(/kulturorte*/g, `${type}/${_id}`);
  request.sendNotificationEmail(url, email);
  return h.continue;
};

sendNotification.applyPoint = 'onPreResponse';

module.exports = sendNotification;
