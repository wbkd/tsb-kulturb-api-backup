const Joi = require('joi');

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const _id = ObjectId.required();
const name = Joi.string();

const findById = {
  params: {
    _id,
  },
};

const find = {
  name,
};

const create = {
  payload: {
    name: name.required(),
  },
};

const update = {
  payload: {
    name,
  },
};

const remove = {
  params: {
    _id,
  },
};

module.exports = {
  find,
  findById,
  create,
  update,
  remove,
};
