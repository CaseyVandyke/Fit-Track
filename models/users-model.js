'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
username: String,
password: String,
avatar: String,
firstName: String,
lastName: String,
email: String,
isAdmin: {type: Boolean, default: false}
});


UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
}

const User = mongoose.model('users', UserSchema);

module.exports = User;



