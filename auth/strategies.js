'use strict';
const { Strategy: LocalStrategy } = require('passport-local');

// Assigns the Strategy export to the name JwtStrategy using object destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const User = require('./../models/users-model');
const { JWT_SECRET } = require('../config');

const localStrategy = new LocalStrategy((username, password, passportVerify) => {
  let user;
  //console.log("username=" + username);
  //console.log("password=" + password);
  User.findOne({ username: username })
    .then(_user => {
      user = _user;
     // console.log(user);
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      //console.log(isValid);
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return passportVerify(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return passportVerify(null, false, err);
      }
      return passportVerify(err, false);
    });
});

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  (token, done) => {
    done(null, token.user);
  }
);

module.exports = { localStrategy, jwtStrategy };