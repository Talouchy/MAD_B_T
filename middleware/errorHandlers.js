const logger = require('../lib/logger');

function errorHandler (err, req, res, next) {
    let status = err.status || 500;
    let errors = Array.isArray(err) ? err : [err];

    if (status === 500) {
        logger.log('error', 'Internal Server Error');
        errors = [{message: 'Internal Server Error'}];
    }
    res.status(status).json({ errors });
}

function logErrors (err, req, res, next) {
    logger.log('error', `[${err.status}] => ${err.message}`);
    next(err)
}

module.exports = { logErrors, errorHandler };