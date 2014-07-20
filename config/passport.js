'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
    authController = require('../app/controllers/auth'),
    BasicStrategy = require('passport-http').BasicStrategy,
    ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy;

module.exports = function() {
  // User basic strategy
  passport.use(new BasicStrategy(authController.userAuthenticate));

  // Client strategies
  passport.use('client-basic', new BasicStrategy(authController.clientAuthenticate));
  passport.use(new ClientPasswordStrategy(authController.clientAuthenticate));

  // Bearer strategy
  passport.use(new BearerStrategy(authController.bearerAuthenticate));
};