const express = require ('express');
const createError = require('http-errors');
const {User, UserSchema} = require('../models/user');
const {BusRoute, BusRouteSchema} = require('../models/busRoute');

function userRouter() {
    const router = express.Router();

    // get a list of Users from the db
    router.get('/', function(req, res, next){
        User.find({})
        .populate('busRoutes', '-_id -__v')
        .then((user) => {
            res.send(user);
        })
        .catch((err) => next(createError(422, err.message)));
    });

    // get a single Users from the db
    router.get('/:id', function(req, res, next){
        User.findById( req.params.id, '-password -_id')
        .populate('busRoutes', '-_id -__v')
        .then((user) => {
            if(!user) throw createError(404, 'User not found')
            res.send(user);
        })
        .catch(next);
    });

    // add a new User to the db
    router.post('/', function(req, res, next) {
        User.create(req.body)
        .then((user) => {
            res.send(user);
        })
        .catch((err) => next(createError(422, err.message)));
    });

    // update a User in the db
    router.put('/:id', function(req, res, next){
        User.findOneAndUpdate({_id: req.params.id}, req.body)
        .then((user) => {
            if(!user) throw createError(404, 'User not found')
            User.findOne({_id: req.params.id})
            .then((user) => {
                if(!user) throw createError(404, 'User not found')
                res.send(user);
            })
            .catch((err) => next(createError(422, err)));
        })
        .catch(next);
    });

    // update Bus Route of a User
    router.put('/:id/bus-route', function(req, res, next) {
        User.findOne({_id: req.params.id})
        .then((user) => {
            if(!user) throw createError(404, 'User not found')
            let oldUser = user;
            if (Object.keys(req.body).length === 0)
                throw createError(422, 'Bus route not selected');
            BusRoute.findOne(req.body)
            .then((busRoute) => {
                var updatedUser = oldUser;
                var isBusRouteDuplicate = false;
                if(!busRoute) throw createError(404, 'Bus Route not found')
                updatedUser.busRoutes.forEach(element => {
                    if(busRoute.equals(element)) isBusRouteDuplicate = true;
                });
                if(!isBusRouteDuplicate) {
                    updatedUser.busRoutes.push(busRoute);
                    User.findOneAndUpdate({_id: oldUser._id}, {busRoutes: updatedUser.busRoutes})
                    .then((user) => {
                        if(!user) throw createError(404, 'User not found')
                        User.findOne(oldUser._id, '-_id')
                        .populate('busRoutes', '-_id -__v')
                        .then((user) => {
                            if(!user) throw createError(404, 'User not found')
                            res.send(user)
                        });
                    })
                } else throw createError(409, "BusRoute already bookmarked");
            })
            .catch(next);
        })
        .catch(next);
    });

    // delete a User from the db
    router.delete('/:id', function(req, res, next){
        User.deleteOne({_id: req.params.id})
        .then((user) => {
            if (user.ok === true, user.n == 0)
                throw createError(404, "No Such User");
            res.send(user);
        })
        .catch((err) => next(createError(422, err)));
    });

    // delete Bus Route of a User
    router.delete('/:id_u/bus-route/:id_br', function(req, res, next) {
        User.findByIdAndUpdate(req.params.id_u)
        .then((user) => {
            if(!user) throw createError(404, 'User not found')
            user.busRoutes.pull(req.params.id_br);
            user.save();
            res.send(user);
        })
        .catch(next);
    });

    return router;
}

module.exports = userRouter;
