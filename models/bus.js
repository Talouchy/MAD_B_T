const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

// create Bus Schema and model

const BusSchema = new Schema({
    busCompany: {
        type: String,
        required: [true, 'Bus Company name is required'],
        maxlength: [25, "Max length is 25 charecters"]
    },
    busModel: {
        type: String,
        required: [true, 'Bus Model is required'],
        maxlength: [25, "Max length is 15 charecters"]
    },
    busEntrance: {
        type: Number,
        required: [true, 'Bus Entrance width is required']
    },
    busCorridorStart: {
        type: Number,
        required: [true, 'Bus Corridor(start) width is required']
    },
    busAllocatedSpaceEntrance: {
        type: Number,
        required: [true, 'Bus Allocated Space Entrance width is required']
    },
    busAllocatedSpaceLeftLength: {
        type: Number,
        required: [true, 'Bus Allocated Space Left length is required']
    },
    busAllocatedSpaceRightLength: {
        type: Number,
        required: [true, 'Bus Allocated Space Right length is required']
    },
    busAllocatedSpaceWidthFrontLeft: {
        type: Number,
        required: [true, 'Bus Allocated Space Front Left width is required']
    },
    busAllocatedSpaceWidthFrontRight: {
        type: Number,
        required: [true, 'Bus Allocated Space Front Right width is required']
    },
    busAllocatedSpaceWidthRearLeft: {
        type: Number,
        required: [true, 'Bus Allocated Space Rear Left width is required'],
        default: 0
    },
    busAllocatedSpaceWidthRearRight: {
        type: Number,
        required: [true, 'Bus Allocated Space Rear Right width is required']
    },
    busAllocatedSpaceExit: {
        type: Number,
        required: [true, 'Bus Allocated Space Exit width is required']
    },
    leftSeats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seats'    }],
    rightSeats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seats'
    }],
    busCreateDate: { type: Date, default: Date.now },
    busUpdateDate: { type: Date, default: Date.now }
});

BusSchema.plugin(uniqueValidator, {message: 'Bus Exists.'});

const Bus = mongoose.model('buses', BusSchema);

module.exports = { Bus, BusSchema };

/* Example
{
	"busCompany": "CDC",
	"busModel": "7",
	"busEntrance": 856,
	"busCorridorStart": 837,
	"busAllocatedSpaceEntrance": 841,
	"busAllocatedSpaceLeftLength": 1310,
	"busAllocatedSpaceRightLength": 1310,
	"busAllocatedSpaceWidthFrontLeft": 555,
	"busAllocatedSpaceWidthFrontRight": 683,
	"busAllocatedSpaceWidthRearLeft": 751,
	"busAllocatedSpaceWidthRearRight": 760,
	"busAllocatedSpaceExit": 605
}
*/
