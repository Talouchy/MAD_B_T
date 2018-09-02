const express = require ('express');
const User = require('../models/user');
const router = express.Router();

// get a list of ninjas from the db
router.get('/ninjas', function(req, res, next){
    res.send({type: 'GET'});
});

// add a new ninja to the db
router.post('/ninjas', function(req, res, next){
    User.create(req.body).then((user) => {
        res.send(user);
    }).catch(next);
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