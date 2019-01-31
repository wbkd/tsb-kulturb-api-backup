const Joi = require('joi');

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const _id = ObjectId.required();
const name = Joi.string();
const location = Joi.array().length(2).items(Joi.number());
const description = Joi.string();
const website = Joi.string().uri({ scheme: ['http', 'https'] });
const email = Joi.string().email();
const telephone = Joi.string();
const address = Joi.string();
const zipcode = Joi.string().min(3).max(10);
const city = Joi.string();

const findById = {
  params: {
    _id,
  },
};

const find = {
  name,
  location,
  description,
};

const create = {
  payload: {
    name: name.required(),
    location,
    description,
    website,
    email,
    telephone,
    address,
    zipcode,
    city,
  },
};

const update = {
  payload: {
    name,
    location,
    description,
    website,
    email,
    telephone,
    address,
    zipcode,
    city,
  },
};

const remove = {
  params: {
    _id,
  },
};

const relation = {
  params: {
    _id: ObjectId.required(),
    relation: Joi.string().valid(['venues']).required(),
    relId: ObjectId.required(),
  },
};

module.exports = {
  find,
  findById,
  create,
  update,
  remove,
  relation,
};
