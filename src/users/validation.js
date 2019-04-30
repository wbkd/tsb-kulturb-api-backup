const Joi = require('joi');

const email = Joi.string().email().required();
const password = Joi.string().required();
const firstname = Joi.string();
const token = Joi.string().required();
const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const role = Joi.string().valid(['USER', 'ADMIN']);
const organisation = Joi.alternatives().try(Joi.object(), ObjectId);

const create = {
  payload: {
    email,
    password,
    firstname,
    organisation,
  },
};

const login = {
  payload: {
    email,
    password,
  },
};

const refreshToken = {
  query: {
    token,
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

const changeRole = {
  payload: {
    email,
    role,
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
  login,
  refreshToken,
  find,
  verify,
  changePassword,
  changeRole,
  email,
  relation,
};
