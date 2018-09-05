const express = require ('express');
const createError = require('http-errors');
const BusRoute = require('../models/busRoute');

function busRouteRouter() {
    const router = express.Router();

    // get a list of Users from the db
    router.get('/', function(req, res, next){
        BusRoute.find({})
        .then((busRoute) => {
            res.send(busRoute);
        }).catch((err) => next(createError(422, err.message)));
    });

    // get a single of Users from the db
    router.get('/:id', function(req, res, next){
        BusRoute.findOne({_id: req.params.id}, '-password -_id')
        .then((busRoute) => {
            res.send(busRoute);
        }).catch((err) => next(createError(422, err.message)));
    });

    // add a new User to the db
    router.post('/', function(req, res, next) {
        BusRoute.create(req.body)
        .then((busRoute) => {
            res.send(busRoute);
        })
        .catch((err) => next(createError(422, err.message)));
    });

    // update a User in the db
    router.put('/:id', function(req, res, next){
        BusRoute.findOneAndUpdate({_id: req.params.id}, req.body)
        .then((busRoute) => {
            BusRoute.findOne({_id: req.params.id}, '-_id')
            .then((busRoute) => {
                res.send(busRoute);
            })
            .catch((err) => next(createError(422, err.message)));
        })
        .catch((err) => next(createError(422, err.message)));
    });

    // delete a User from the db
    router.delete('/:id', function(req, res, next){
        BusRoute.deleteOne({_id: req.params.id})
        .then((busRoute) => {
            if (busRoute.ok === true, busRoute.n == 0)
                throw createError(404, "No Such User");
            res.send(busRoute);
        })
        .catch((err) => next(createError(422, err.message)));
    });

    return router;
}

module.exports = busRouteRouter;
