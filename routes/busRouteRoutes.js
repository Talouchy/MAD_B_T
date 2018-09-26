const express = require ('express');
const createError = require('http-errors');
const {BusRoute,  } = require('../models/busRoute');

function busRouteRouter() {
    const router = express.Router();

    // get a list of Bus Routes from the db
    router.get('/', function(req, res, next){
        BusRoute.find({})
        .then((busRoute) => {
            res.send(busRoute);
        })
        .catch((err) => next(createError(422, err.message)));
    });

    // get a single Bus Route from the db
    router.get('/:id', function(req, res, next){
        BusRoute.findOne({_id: req.params.id}, '-password -_id')
        .then((busRoute) => {
            if(!busRoute) throw createError(404, 'Bus Route not found')
            res.send(busRoute);
        })
        .catch(next);
    });

    // add a new Bus Route to the db
    router.post('/', function(req, res, next) {
        BusRoute.insertMany(req.body)
        .then((busRoutes) => {
            res.send(busRoutes);
        })
        .catch((err) => next(createError(422, err.message)));
    });

    // update a Bus Route in the db
    router.put('/:id', function(req, res, next){
        BusRoute.findOneAndUpdate({_id: req.params.id}, req.body)
        .then((busRoute) => {
            if(!busRoute) throw createError(404, 'Bus Route not found')
            BusRoute.findOne({_id: req.params.id}, '-_id')
            .then((busRoute) => {
            if(!busRoute) throw createError(404, 'Bus Route not found')
                res.send(busRoute);
            })
            .catch((err) => next(createError(422, err)));
        })
        .catch(next);
    });

    // delete a Bus Route from the db
    router.delete('/:id', function(req, res, next){
        BusRoute.deleteOne({_id: req.params.id})
        .then((busRoute) => {
            if (busRoute.ok === true, busRoute.n == 0)
                throw createError(404, "No Such User");
            res.send(busRoute);
        })
        .catch((err) => next(createError(422, err)));
    });

    return router;
}

module.exports = busRouteRouter;
