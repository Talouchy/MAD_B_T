const express = require ('express');
const routes = require('../routes');

function version1Router() {
    var router = express.Router();

    router.use('/user', routes.UserRoutes());

    router.use('/bus-route', routes.BusRouteRoutes());

    router.use('/seat', routes.SeatRoutes());

    router.use('/bus', routes.BusRoutes());

    return router;
}

module.exports = version1Router;