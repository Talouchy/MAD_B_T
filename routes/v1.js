const express = require ('express');
const createError = require('http-errors');
const User = require('../models/user');
const router = express.Router();

// get a list of Users from the db
router.get('/ninjas', function(req, res, next){
    User.find({}).then((user) => {
        res.send(user);
    }).catch(next);
});

// add a new User to the db
router.post('/ninjas', function(req, res, next) {
    User.create(req.body)
    .then((user) => {
        res.send(user);
    })
    .catch((err) => {
        next(createError(422, err.message))
    })
});

// update a ninja in the db
router.put('/ninjas/:id', function(req, res, next){
    res.send({type: 'PUT'});
});

// delete a ninja from the db
router.delete('/ninjas/:id', function(req, res, next){
    res.send({type: 'DELETE'});
});

module.exports = router;