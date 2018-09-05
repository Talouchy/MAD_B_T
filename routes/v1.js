const express = require ('express');
const createError = require('http-errors');
const User = require('../models/user');
const router = express.Router();

// get a list of Users from the db
router.get('/user', function(req, res, next){
    User.find({}).then((user) => {
        res.send(user);
    }).catch((err) => next(createError(422, err.message)));
});

// add a new User to the db
router.post('/user', function(req, res, next) {
    User.create(req.body)
    .then((user) => {
        res.send(user);
    })
    .catch((err) => next(createError(422, err.message)));
});

// update a User in the db
router.put('/user/:id', function(req, res, next){
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
router.delete('/user/:id', function(req, res, next){
    User.deleteOne({_id: req.params.id})
    .then((user) => {
        if (user.ok === true, user.n == 0)
            throw createError(404, "No Such User");
        res.send(user);
    })
    .catch((err) => next(createError(422, err.message)));
});

module.exports = router;