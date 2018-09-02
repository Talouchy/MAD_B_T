const logger = require('../lib/logger');

function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' })
    } else {
      next(err)
    }
  }

  function errorHandler (err, req, res, next) {
    res.status(422)
    // logger.log('warn', "ridi");
    res.send({ error: err.message});
  }

  function logErrors (err, req, res, next) {
    console.error(err.stack)
    next(err)
  }

  module.exports = { clientErrorHandler, errorHandler, logErrors };