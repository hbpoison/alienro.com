/**
 * Module dependencies
 */
var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    User = require('../models/user'),
    Client = require('../models/client'),
    Token = require('../models/token');

/**
 * BasicStrategy used to athenticate registered user
 */
 passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findOne({
      $or: [
        { name: username },
        { email: username }
      ]
    }, function(err, user) {
      if (err) {
        return callback(err);
      }

      // No user found
      if (!user) {
        return callback(null, false);
      }

      // Make sure password correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) {
          return callback(err);
        }

        // Bad password
        if (!isMatch) {
          return callback(null, false);
        }

        // Success
        return callback(null, user);
      });
    });
  }
));

passport.use('client-basic', new BasicStrategy(
  function(clientId, clientSecret, callback) {
    Client.findById(clientId, function(err, client) {
      if (err)
        return callback(err);

      // No client found or bad secret
      if (!client || client.secret !== clientSecret)
        return callback(null, false);

      // Success
      return callback(null, client);
    });
  }
));

passport.use(new ClientPasswordStrategy(
  function(clientId, clientSecret, callback) {
    Client.findById(clientId, function(err, client) {
      if (err)
        return callback(err);
      if (!client || client.secret !== clientSecret)
        return callback(null, false);
      return callback(null, client);
    });
  }
));

passport.use(new BearerStrategy(
  function(accessToken, callback) {
    Token.findOne({ value: accessToken }).populate('user').exec(function(err, token) {
      if (err)
        return callback(err);

      if (!token || !token.user)
        return callback(null, false);

      callback(null, token.user, { scope: '*' });
    });
  }
));

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false });

exports.isClientAuthenticated = passport.authenticate(['client-basic', 'oauth2-client-password'], { session: false });

exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });

