 'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String, 
        default: '',
    },
    lastName: {
        type: String, 
        default: '',
    }
});

UserSchema.methods.serialize = function() {
    return {
        username: this.username || '',
        id: this._id || '',
        firstName: this.firstName || '',
        lastName: this.lastName || '',
    };
};



UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
}

const User = mongoose.model('users', UserSchema);

module.exports = User;



