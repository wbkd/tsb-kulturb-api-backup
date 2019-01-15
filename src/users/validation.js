const Joi = require('joi');

const email = Joi.string().email().required();
const password = Joi.string().required();
const firstname = Joi.string();
const token = Joi.string().required();
const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const create = {
  payload: {
    email,
    password,
    firstname,
  },
};

const find = {
  email: Joi.string().email(),
  firstname,
};

const verify = {
  query: {
    email,
    token,
  },
};

const changePassword = {
  payload: {
    email,
    token,
    password,
  },
};

const relation = {
  params: {
    _id: ObjectId.required(),
    relation: Joi.string().valid(['organisation']).required(),
    relId: ObjectId.required(),
  },
};

module.exports = {
  create,
  find,
  verify,
  changePassword,
  email,
  relation,
};
