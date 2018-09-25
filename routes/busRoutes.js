const express = require ('express');
const createError = require('http-errors');
const { Bus, BusSchema } = require('../models/bus');
const { Seat, SeatSchema } = require('../models/seat');

function busRouter() {
    const router = express.Router();

    // get a list of Buses from the db
    router.get('/', function(req, res, next){
        Bus.find({})
        .populate('leftSeats', '-_id -__v')
        .populate('rightSeats', '-_id -__v')
        .then((bus) => {
            res.send(bus);
        })
        .catch((err) => next(createError(422, err.message)));
    });

    // get a single Bus from the db
    router.get('/:id', function(req, res, next){
        Bus.findById( req.params.id, '-__v -_id')
        .populate('leftSeats', '-_id -__v')
        .populate('rightSeats', '-_id -__v')
        .then((bus) => {
            if(!bus) throw createError(404, 'Bus not found')
            res.send(bus);
        })
        .catch(next);
    });

    // add a new Bus to the db
    router.post('/', function(req, res, next) {
      Bus.insertMany(req.body)
      .then((buses) => {
          res.send(buses);
      })
      .catch((err) => next(createError(422, err.message)));
    });

    // update a Bus in the db
    router.put('/:id', function(req, res, next){
        if (Object.keys(req.body).length === 0)
            throw createError(422, 'Unprocessable Entity');
        req.body.busUpdateDate = new Date().toISOString();
        Bus.findOneAndUpdate({_id: req.params.id}, req.body)
        .then((bus) => {
            if(!bus) throw createError(404, 'Bus not found')
            Bus.findOne({_id: req.params.id})
            .then((bus) => {
                if(!bus) throw createError(404, 'Bus not found')
                res.send(bus);
            })
            .catch((err) => next(createError(422, err)));
        })
        .catch(next);
    });

    // update Bus Seats
    router.put('/:id/seat/:side', function(req, res, next) {
        if (Object.keys(req.body).length === 0)
            throw createError(422, 'Seat not selected');
        req.body.forEach((addingSeat)  => {
            Bus.findOne({_id: req.params.id})
            .then((bus) => {
                if(!bus) throw createError(404, 'Bus not found')
                Seat.findById(addingSeat._id)
                .then((seat) => {
                    if(!seat) throw createError(404, 'Seat not found')
                    let i = 0;
                    while( i < addingSeat.quantity) {
                        switch(req.params.side) {
                            case "right":
                                bus.rightSeats.push(seat);
                                break;

                            case "left":
                                bus.leftSeats.push(seat);
                                break;
                            default:
                                throw createError(404, 'Not found');
                        }
                        i++;
                    }

                    bus.busUpdateDate = new Date().toISOString();
                    bus.save()
                    .catch(next);
                })
                .catch(next);
            })
            .catch(next);
        });

        Bus.findById(req.params.id)
        .populate('leftSeats')
        .populate('rightSeats')
        .then((bus) => { res.send(bus) })
//      FIXME: Does not return errors
    });

    // delete a Bus from the db
    router.delete('/:id', function(req, res, next){
        Bus.deleteOne({_id: req.params.id})
        .then(( bus) => {
            if (bus.ok === true, bus.n == 0)
                throw createError(404, "No Such Bus");
            res.send(bus);
        })
        .catch((err) => next(createError(422, err)));
    });

    // delete Seat of a Bus
    router.delete('/:id_b/seat/:side/:id_s', function(req, res, next) {
        Bus.findByIdAndUpdate(req.params.id_b)
        .then((bus) => {
            if(!bus) throw createError(404, 'Bus not found')
            switch(req.params.side) {
                case "right":
                    bus.rightSeats.some((element, index) => {
                        if(element.equals(req.params.id_s))
                            bus.rightSeats.splice(index, 1);
                        return true;
                    });
                    break;

                case "left":
                    bus.leftSeats.some((element, index) => {
                        if(element.equals(req.params.id_s))
                            bus.leftSeats.splice(index, 1);
                        return true;
                    });
                    break;
                default:
                    throw createError(404, 'Not found')
            }
            bus.busUpdateDate = new Date().toISOString();
            bus.save();
            res.send(bus);
        })
        .catch(next);
    });

    return router;
}

module.exports = busRouter;
