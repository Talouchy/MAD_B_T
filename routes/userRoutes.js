const express = require ('express');
const createError = require('http-errors');
const CONFIG = require('../config/config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User, UserSchema} = require('../models/user');
const {BusRoute, BusRouteSchema} = require('../models/busRoute');

function userRouter() {
    const router = express.Router();

    // authenticate user token
    router.get('/authenticate', function(req, res, next){
      if(req.decoded) {
        res.status(200).send({
            auth: true,
            message: "Token authenticated"
        })
        next()
      } else throw createError(401, 'Failed to Authenticate')
    });

    // authenticate Users email and pass
    router.post('/authenticate', function(req, res, next){
        if(!req.body.email && !req.body.password) throw createError(422, 'Email and password required.');
        User.findOne({ email:req.body.email })
        .populate('busRoutes', '-_id -__v')
        .then((user) => {
            if(!user) throw createError(404, 'Invalid email or password!');
            var isMatch = bcrypt.compareSync(req.body.password, user.password);

            if(isMatch) {
                const payload = {
                    id: user.id
                };

                var token = jwt.sign(payload, CONFIG.jwt_encryption, {
                    expiresIn: CONFIG.jwt_expiration
                });

                delete user.password;
                delete user._id;
                user.token = token;

                res.send({
                    "busRoutes": user.busRoutes,
                    "email": user.email,
                    "regDate": user.regDate,
                    "token": token
                });
                } else throw createError(401, 'Incorrect Email or password');
        })
        .catch(next);
    });

    // get a the user from the db
    router.get('/me', function(req, res, next){
      if(req.decoded) {
        User.findOne({_id: req.decoded.id})
        .populate('busRoutes', '-__v')
        .then((user) => {
            res.send(user);
        })
        .catch((err) => next(createError(422, err.message)))
      } else throw createError(401, 'Failed to Authenticate')
    });

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
        req.body.password = bcrypt.hashSync(req.body.password, 8);

        User.create(req.body)
        .then((user) => {
            if(!user) throw createError(404, 'User not found')
            // TODO: remove user password
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
    router.put('/bus-route/add', function(req, res, next) {
        User.findOne({_id: req.decoded.id})
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
    router.delete('/bus-route/:id_br', function(req, res, next) {
      if(req.decoded) {
        User.findByIdAndUpdate(req.decoded.id)
        .then((user) => {
            if(!user) throw createError(404, 'User not found')
            user.busRoutes.pull(req.params.id_br);
            user.save();
            res.send(user);
        })
        .catch(next);
      } else throw createError(401, 'Failed to Authenticate')
    });

    return router;
}

module.exports = userRouter;
