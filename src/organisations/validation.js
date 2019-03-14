const Joi = require('joi');

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const _id = ObjectId.required();
const name = Joi.string();
const location = Joi.object({
  type: Joi.string().valid('Point'),
  coordinates: Joi.array().length(2).items(Joi.number()),
});
const description = Joi.string().allow('');
const website = Joi.string().uri({ scheme: ['http', 'https'] }).allow('');
const email = Joi.string().email().allow('');
const telephone = Joi.string().allow('');
const address = Joi.string().allow('');
const zipcode = Joi.string().min(3).max(10).allow('');
const city = Joi.string().allow('');
const tags = Joi.array();
const venues = Joi.array();
const limit = Joi.number();
const skip = Joi.number();
const types = Joi.array().items(Joi.string().valid(['organisation', 'venue']));
const sort = Joi.string();
const order = Joi.string().valid(['ascend', 'descend']);
const fields = Joi.array();

const search = {
  query: {
    name: Joi.string(),
    limit,
    skip,
  },
};

const find = {
  query: {
    name,
    location,
    description,
    website,
    email,
    telephone,
    address,
    zipcode,
    city,
    tags,
    limit,
    skip,
    types,
    sort,
    order,
    fields,
  },
};

const findById = {
  params: {
    _id,
  },
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
    tags,
    types,
    venues,
  },
};

const importer = {
  payload: {
    file: Joi.any().required(),
  },
};

const exporter = {
  query: find.query,
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
    tags,
    types,
    venues,
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
  search,
  find,
  findById,
  create,
  importer,
  exporter,
  update,
  remove,
  relation,
};
