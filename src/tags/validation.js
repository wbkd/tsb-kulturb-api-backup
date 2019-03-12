const Joi = require('joi');

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const _id = ObjectId.required();
const name = Joi.string();
const limit = Joi.number();
const skip = Joi.number();
const sort = Joi.string();
const order = Joi.string().valid(['ascend', 'descend']);
const fields = Joi.array();

const findById = {
  params: {
    _id,
  },
};

const find = {
  query: {
    name,
    limit,
    skip,
    sort,
    order,
    fields,
  },
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
