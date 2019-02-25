const Joi = require('joi');

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const _id = ObjectId.required();

const create = {
  payload: {
    relation: Joi.string().valid(['location', 'venue']).required(),
    type: Joi.string().valid(['logo', 'image']).required(),
    relId: _id.required(),
    file: Joi.any().required(),
  },
  headers: Joi.object().keys({
    'content-type': Joi.string().required().valid(['image/jpeg', 'image/png']),
  }).unknown(),
};

const remove = {
  params: {
    _id,
  },
};

module.exports = {
  create,
  remove,
};
