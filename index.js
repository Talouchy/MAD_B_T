const express = require('express');
const bodyParser = require('body-parser');
const CONFIG = require('./config/config');
const db = require('./lib/db');
const logger = require('./lib/logger');
const middleware = require('./middleware');

const apiVersionRouter = require('./versions/v1');

// set up express app
const app = express();

// initialize body parser
app.use(bodyParser.json());

// Authentication middleware
app.use(middleware.Authentication.verifyHeaderToken);

// initialize routes
app.use('/v1', apiVersionRouter());

// error logging middleware
app.use(middleware.ErrorHandler.logErrors);

// error handeling middleware
app.use(middleware.ErrorHandler.errorHandler);

// listen for requests
app.listen(CONFIG.port, function(){
    logger.log('info', `now listening for requests on Port ${CONFIG.port}`);
});
