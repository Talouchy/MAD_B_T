const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

// create user Schema and model

const UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Email address is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    regDate: {
        type: Date,
        default: Date.now,
        required: true
    }

});

UserSchema.plugin(uniqueValidator, {message: 'Email is already taken.'});

const User = mongoose.model('user', UserSchema);

module.exports = User;