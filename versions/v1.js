const express = require ('express');
const routes = require('../routes');

function version1Router() {
    var router = express.Router();

    router.use('/user', routes.UserRoutes());

    router.use('/bus-route', routes.BusRouteRoutes());

    return router;
}

module.exports = version1Router;