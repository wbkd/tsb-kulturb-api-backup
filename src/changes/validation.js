const Joi = require('joi');
const Organisation = require('../organisations/validation');

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const _id = ObjectId.required();
const limit = Joi.number();
const skip = Joi.number();
const sort = Joi.string();
const order = Joi.string().valid(['ascend', 'descend']);
const fields = Joi.array();

const search = {
  query: {
    name: Joi.string(),
    limit,
    skip,
    sort,
    order,
  },
};

const find = {
  query: {
    limit,
    skip,
    sort,
    order,
    fields,
    create: Joi.boolean(),
  },
};

const findById = {
  params: {
    _id,
  },
};

const { create } = {
  meta: {
    organisation: _id,
  },
  data: Organisation,
};

const importer = {
  payload: {
    file: Joi.any().required(),
  },
};

const exporter = {
  query: find.query,
};

const { update } = Organisation;

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

const failAction = async (request, h, err) => {
  if (process.env.NODE_ENV === 'production') {
    // In prod, log a limited error message and throw the default Bad Request error.
    console.error('ValidationError:', err.message);
    throw Boom.badRequest(`Invalid request payload input`);
  } else {
    // During development, log and respond with the full error.
    console.error(err);
    throw err;
  }
};

update.failAction = failAction;

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
