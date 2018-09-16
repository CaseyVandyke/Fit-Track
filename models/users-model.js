'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
   local: {
       username: String,
       password: String
   }
});

UserSchema.methods.generatHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

const User = mongoose.model('users', UserSchema);

module.exports = User;



