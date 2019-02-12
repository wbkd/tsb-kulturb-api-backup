const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const uniqueValidator = require('mongoose-unique-validator');
const arrayUniquePlugin = require('mongoose-unique-array');

mongoose.plugin(autopopulate);
mongoose.plugin(uniqueValidator);
mongoose.plugin(arrayUniquePlugin);

const register = async (server, options) => {
  const url = options.url || 'mongodb://localhost:27017/test';

  try {
    const db = await mongoose.connect(url, { useNewUrlParser: true });

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
