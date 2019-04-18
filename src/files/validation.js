const Joi = require('joi');

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const _id = ObjectId.required();

const create = {
  payload: {
    relation: Joi.string().valid(['location', 'venue']).required(),
    type: Joi.string().valid(['logo', 'teaser']).required(),
    relId: _id.required(),
    file: Joi.any().required(),
  },
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
