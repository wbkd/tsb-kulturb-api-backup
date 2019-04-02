const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const uniqueValidator = require('mongoose-unique-validator');
const arrayUniquePlugin = require('mongoose-unique-array');
const deleteEmptyValuesPlugin = require('./deleteEmptyValuesPlugin');

mongoose.plugin(autopopulate);
mongoose.plugin(uniqueValidator);
mongoose.plugin(arrayUniquePlugin);
mongoose.plugin(deleteEmptyValuesPlugin);

const register = async (server, options) => {
  const url = options.url || 'mongodb://localhost:27017/test';

  try {
    const db = await mongoose.connect(url, {
      useCreateIndex: true,
      useNewUrlParser: true,
    });

    server.decorate('server', 'mongoose', db);
    server.decorate('request', 'models', db.models);
  } catch (err) {
    server.log(['db', 'error'], `Error connecting to the database ${url}`);
  }
};

exports.plugin = {
  name: 'db',
  version: '0.0.1',
  register,
};
