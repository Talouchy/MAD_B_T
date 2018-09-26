const express = require ('express');
const createError = require('http-errors');
const { Mad, MadSchema } = require('../models/mad');

function madRouter() {
    const router = express.Router();

    // get a list of Mads from the db
    router.get('/', function(req, res, next){
        Mad.find({})
        .then((mad) => {
            res.send(mad);
        })
        .catch((err) => next(createError(422, err.message)));
    });

    // get a single mad from the db
    router.get('/:id', function(req, res, next){
        mad.findById( req.params.id, '-__v -_id')
        .then((mad) => {
            if(!mad) throw createError(404, 'Device not found')
            res.send(mad);
        })
        .catch(next);
    });

    // add a new mads to the db
    router.post('/', function(req, res, next) {
      Mad.insertMany(req.body)
      .then((mads) => {
          res.send(mads);
      })
      .catch((err) => next(createError(422, err)));
    });

    // delete a Mad from the db
    router.delete('/:id', function(req, res, next){
        Mad.deleteOne({_id: req.params.id})
        .then(( mad) => {
            if (mad.ok === true, mad.n == 0)
                throw createError(404, "Device Not Found");
            res.send(mad);
        })
        .catch((err) => next(createError(422, err)));
    });

    return router;
}

module.exports = madRouter;
