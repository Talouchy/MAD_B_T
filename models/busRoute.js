const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

// create BusRoute Schema and model

const BusRouteSchema = new Schema({
    busRouteNumber: {
        type: String,
        unique: true,
        required: [true, 'Bus Route number is required'],
        match: [/^\d{3}$/, 'Please fill a valid Bus Route']
    },
    busRouteIsAcvtive: {
        type: Boolean,
        default: false
    }

});

BusRouteSchema.plugin(uniqueValidator, {message: 'Bus Route Exists.'});

const BusRoute = mongoose.model('busroutes', BusRouteSchema);

module.exports = {BusRoute, BusRouteSchema};