const express = require ('express');
const createError = require('http-errors');
const { Seat } = require('../models/seat');

function seatRouter() {
    const router = express.Router();

    // get a list of Seats from the db
    router.get('/', function(req, res, next){
        Seat.find({})
        .then((seats) => {
            res.send(seats);
        })
        .catch((err) => next(createError(422, err.message)));
    });

    // get a single Seat from the db
    router.get('/:id', function(req, res, next){
        Seat.findOne({_id: req.params.id}, '-_id')
        .then((seat) => {
            if(!seat) throw createError(404, 'Seat not found')
            res.send(seat);
        })
        .catch(next);
    });

    // add a new Seat to the db
    router.post('/', function(req, res, next) {
        Seat.create(req.body)
        .then((seat) => {
            res.send(seat);
        })
        .catch((err) => next(createError(422, err.message)));
    });

    // update a Seat in the db
    router.put('/:id', function(req, res, next){
        Seat.findOneAndUpdate({_id: req.params.id}, req.body)
        .then((seat) => {
            if(!seat) throw createError(404, 'Seat not found')
            Seat.findOne({_id: req.params.id}, '-_id')
            .then((seat) => {
            if(!seat) throw createError(500, 'Seat not found, 2')
                res.send(seat);
            })
            .catch(next);
        })
        .catch(next);
    });

    // delete a Seat from the db
    router.delete('/:id', function(req, res, next){
        Seat.deleteOne({_id: req.params.id})
        .then((seat) => {
            if (seat.ok === true, seat.n == 0)
                throw createError(404, "No Such Seat");
            res.send(seat);
        })
        .catch(next);
    });

    return router;
}

module.exports = seatRouter;
