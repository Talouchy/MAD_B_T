const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

// create Seat Schema and model
const SeatSchema = new Schema({
    title: {
        type: String,
        maxlength: [30, "Max length is 30 charecters"],
        unique: true
    },
    capacity: {
        type: Number,
        required: [true, 'Bus Route number is required'],
        match: [/^\d{3}$/, 'Please fill a valid Bus Route']
    },
    isSideways: {
        type: Boolean
    },
    isFoldable: {
        type: Boolean
    }
});

SeatSchema.plugin(uniqueValidator, {message: 'Seat title Exists.'});

const Seat = mongoose.model('seats', SeatSchema);

module.exports = {Seat, SeatSchema};


/* Example
[
	{
		"_id": "5b9341ab922b760e222722be",
		"quantity": 3
	},
	{
		"_id": "5b93410d922b760e222722bd",
		"quantity": 1
	}
]   
*/