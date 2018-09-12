const logger = require('../lib/logger');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');

function verifyHeaderToken ( req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) return next();

    jwt.verify(token, CONFIG.jwt_encryption, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
        }
        req.decoded = decoded;
        console.log(decoded);

        next();
    });
}

module.exports = { verifyHeaderToken };