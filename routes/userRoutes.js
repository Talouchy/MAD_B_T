const express = require ('express');
const createError = require('http-errors');
const User = require('../models/user');

function userRouter() {
    const router = express.Router();

    // get a list of Users from the db
    router.get('/', function(req, res, next){
        User.find({}).then((user) => {
            res.send(user);
        }).catch((err) => next(createError(422, err.message)));
    });

    // get a single of Users from the db
    router.get('/:id', function(req, res, next){
        User.findOne({_id: req.params.id}, '-password -_id').then((user) => {
            res.send(user);
        }).catch((err) => next(createError(422, err.message)));
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
            User.findOne({_id: req.params.id})
            .then((user) => {
                res.send(user);
            })
            .catch((err) => next(createError(422, err.message)));
        })
        .catch((err) => next(createError(422, err.message)));
    });

    // delete a User from the db
    router.delete('/:id', function(req, res, next){
        User.deleteOne({_id: req.params.id})
        .then((user) => {
            if (user.ok === true, user.n == 0)
                throw createError(404, "No Such User");
            res.send(user);
        })
        .catch((err) => next(createError(422, err.message)));
    });

    return router;
}

module.exports = userRouter;
