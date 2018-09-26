const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

// create Mad Schema and model

const MadSchema = new Schema({
    make: {
        type: String,
        required: [true, 'Company name is required'],
        maxlength: [25, "Max length is 25 charecters"]
    },
    model: {
        type: String,
        required: [true, 'Device Model is required'],
        maxlength: [25, "Max length is 15 charecters"]
    },
    type: {
        type: String,
        enum: ['scooter', 'wheelchair'],
        required: [true, 'Device type is required']
    },
    wheelCount: {
        type: Number,
        min: [3, 'Number of wheels cannot be less than 3!'],
        required: [true, 'Number of wheels is required']
    },
    drive: {
        type: String,
        enum: ['rear-wheel', 'middle-wheel'],
        required: [true, 'Device drive placement is required']
    },
    class: {
        type: String,
        enum: ['indoor', 'indoor-outdoor', 'outdoor'],
        required: [true, 'Device class type is required']
    },
    length: {
        type: Number,
        required: [true, 'Device length is required']
    },
    width: {
        type: Number,
        required: [true, 'Device width is required']
    },
    height: {
        type: Number,
        required: [true, 'Devece height is required']
    },
    diagonal: {
        type: Number,
        required: [true, 'Device diagonal length is required']
    },
    weight: {
        type: Number,
        required: [true, 'Device weight is required']
    },
    turnRadius: {
        type: Number
    },
    driveWheelDiameter: {
        type: Number
    },
    frontWheelDiameter: {
        type: Number
    },
    rearWheelDiameter: {
        type: Number
    },
    createDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now }
});

// MadSchema.plugin(uniqueValidator, {message: 'Device Already Exists.'});

const Mad = mongoose.model('mad', MadSchema);

module.exports = { Mad, MadSchema };
