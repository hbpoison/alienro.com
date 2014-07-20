'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    mongoose = require('mongoose'),
    crypto = require('crypto'),
    User = mongoose.model('User'),
    Client = mongoose.model('Client'),
    Token = mongoose.model('Token'),
    oauth2 = require('../../config/oauth2');

/**
 * [userAuthenticate basic strategy function]
 * @param  {[type]}   username [description]
 * @param  {[type]}   password [description]
 * @param  {Function} done     [description]
 * @return {[type]}            [description]
 */
exports.userAuthenticate = function(username, password, done) {
  User.findOne({ $or: [
    { username: username },
    { email: username } 
  ]}, function(err, user) {
    if (err) return done(err);

    if (!user)
      return done(null, false, { message: 'Unknown user' });

    if (!user.authenticate(password))
      return done(null, false, { message: 'Invalid password' });

    return done(null, user);
  });
};

/**
 * [clientAuthenticate client strategy function]
 * @param  {[type]}   clientId [description]
 * @param  {[type]}   secret   [description]
 * @param  {Function} done     [description]
 * @return {[type]}            [description]
 */
exports.clientAuthenticate = function(clientId, secret, done) {
  Client.findById(clientId, function(err, client) {
    if (err) return done(err);

    if (!client || client.secret !== secret)
      return done(null, false, { message: 'Invalid client' });

    return done(null, client);
  });
};

/**
 * [bearerAuthenticate token strategy function]
 * @param  {[type]}   accessToken [description]
 * @param  {Function} done        [description]
 * @return {[type]}               [description]
 */
exports.bearerAuthenticate = function(accessToken, done) {
  Token.findOne({ value: accessToken }).populate('user').exec(function(err, token) {
    if (err) return done(err);

    if (!token || !token.user) return done(null, false, { message: 'Invalid token' });

    return done(null, token.user, { scope: '*' });
  });
};

/**
 * [authenticated description]
 * @type {[type]}
 */
exports.authenticated = passport.authenticate(['basic', 'bearer'], { session : false });

/**
 * [clientAuthenticated description]
 * @type {[type]}
 */
exports.clientAuthenticated = passport.authenticate(['client-basic', 'oauth2-client-password'], { session: false });

/**
 * [userPasswordExchange description]
 * @param  {[type]}   client   [description]
 * @param  {[type]}   username [description]
 * @param  {[type]}   password [description]
 * @param  {[type]}   scope    [description]
 * @param  {Function} done     [description]
 * @return {[type]}            [description]
 */
exports.userPasswordExchange = function(client, username, password, scope, done){
  User.findOne({ username: username }, function(err, user) {
    if (err) return done(err);

    if (!user) return done(null, false, { message: 'Unknown user' });

    if (!user.authenticate(password))
      return done(null, false, { message: 'Invalid passowrd' });

    // delete used tokens
    Token.remove({
      user: user._id,
      client: client._id
    }, function(err) {
      if (err) return done(err);

      var token = new Token({
        value: crypto.randomBytes(32).toString('base64'),
        client: client._id,
        user: user._id
      });

      token.save(function(err) {
        if (err) return done(err);

        done(null, token);
      });
    });
  });
};

/**
 * [token description]
 * @type {Array}
 */
exports.token = [oauth2.server.token(), oauth2.server.errorHandler()];
