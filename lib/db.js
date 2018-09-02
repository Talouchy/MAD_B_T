const mongoose = require('mongoose');
const CONFIG = require('../config/config');
const logger = require('./logger');

const url = `mongodb://${CONFIG.db_host}:${CONFIG.db_port}/${CONFIG.db_name}`;
// connect to mongo DB
// mongoose.connect('mongodb://localhost/MadBusTransport');

mongoose.Promise = global.Promise;

mongoose.connect(url, { useNewUrlParser: true }, () => logger.log('info', 'Mongo is connected') );

module.exports = {
  connection: mongoose.connection,
};