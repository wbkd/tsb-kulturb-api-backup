const Joi = require('joi');

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const _id = ObjectId.required();
const name = Joi.string();
const location = Joi.object({
  type: Joi.string().valid('Point'),
  coordinates: Joi.array().length(2).items(Joi.number()),
}).allow(null);
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
const published = Joi.boolean();
const funded = Joi.boolean();
const openingHours = Joi.string().allow('');
const accessibility = Joi.object({
  wheelchair: Joi.object({
    accessible: Joi.string().valid(['yes', 'no', 'limited', 'unknown']),
    toilets: Joi.bool(),
    description: Joi.string().allow(''),
  }),
  blind: Joi.object({
    germanLanguage: Joi.bool(),
    otherLanguages: Joi.array(),
    easyLanguage: Joi.bool(),
    braille: Joi.bool(),
    guidance: Joi.bool(),
    audioguide: Joi.bool(),
    description: Joi.string().allow(''),
  }),
  deaf: Joi.object({
    germanLanguage: Joi.bool(),
    otherLanguages: Joi.array(),
    easyLanguage: Joi.bool(),
    subtitles: Joi.bool(),
    signLanguage: Joi.bool(),
    hearingAid: Joi.bool(),
    videoGuide: Joi.bool(),
    description: Joi.string().allow(''),
  }),
});
const transportation = Joi.object({
  tram: Joi.string().max(130).allow(''),
  bus: Joi.string().max(130).allow(''),
  subway: Joi.string().max(130).allow(''),
  railway: Joi.string().max(130).allow(''),
});

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
    name,
    location,
    description,
    published,
    website,
    twitter: website,
    facebook: website,
    youtube: website,
    instagram: website,
    email,
    telephone,
    address,
    zipcode,
    city,
    accessibility,
    transportation,
    funded,
    openingHours,
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
    published,
    website,
    twitter: website,
    facebook: website,
    youtube: website,
    instagram: website,
    email,
    telephone,
    address,
    zipcode,
    city,
    accessibility,
    transportation,
    funded,
    openingHours,
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
    published,
    website,
    twitter: website,
    facebook: website,
    youtube: website,
    instagram: website,
    email,
    telephone,
    address,
    zipcode,
    city,
    accessibility,
    transportation,
    funded,
    openingHours,
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
