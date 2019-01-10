const Joi = require('joi');

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const _id = ObjectId.required();
const name = Joi.string();
const location = Joi.array().length(2).items(Joi.number());
const description = Joi.string();

const findById = {
  _id,
};

const find = {
  name,
  location,
  description,
};

const create = {
  name: name.required(),
  location,
  description,
};

const update = {
  name,
  location,
  description,
};

const remove = {
  _id,
};

module.exports = {
  find,
  findById,
  create,
  update,
  remove,
};
