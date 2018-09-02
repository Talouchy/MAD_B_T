const express = require('express');
const bodyParser = require('body-parser');
const CONFIG = require('./config/config');
const db = require('./lib/db');
const logger = require('./lib/logger');
const {logErrors, clientErrorHandler, errorHandler } = require('./middleware/errorHandlers');

const routes = require('./routes/v1');

// set up express app
const app = express();

// initialize body parser
app.use(bodyParser.json());

// initialize routes
app.use('/v1', routes)

// error logging middleware
// app.use(logErrors)

// app.use(clientErrorHandler);

// error handeling middleware
app.use(errorHandler)

// listen for requests
app.listen(CONFIG.port, function(){
    logger.log('info', `now listening for requests on Port ${CONFIG.port}`);
});
