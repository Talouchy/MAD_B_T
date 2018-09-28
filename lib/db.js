const mongoose = require('mongoose');
const CONFIG = require('../config/config');
const logger = require('./logger');

// const url = `mongodb://${CONFIG.db_host}:${CONFIG.db_port}/${CONFIG.db_name}`;
const url = `mongodb://testing:a123456@${CONFIG.db_host}:${CONFIG.db_port}/${CONFIG.db_name}`;
// connect to mongo DB
// mongoose.connect('mongodb://localhost/MadBusTransport');

mongoose.Promise = global.Promise;

mongoose.connect(url, { useNewUrlParser: true }, () => logger.log('info', 'Mongo is connected') );
(CONFIG.app === 'development')?mongoose.set('debug', true):'';
module.exports = {
  connection: mongoose.connection,
};