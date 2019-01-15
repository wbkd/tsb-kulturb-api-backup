const Joi = require('joi');

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const _id = ObjectId.required();

const create = {
  payload: {
    relation: Joi.string().allow(['organisation']).required(),
    type: Joi.string().allow(['logo', 'image']).required(),
    relId: _id.required(),
    file: Joi.any().required(),
  },
  headers: Joi.object().keys({
    'content-type': Joi.string().required().allow(['image/jpeg', 'image/png']),
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
