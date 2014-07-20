'use strict';

/**
 * Module dependencies.
 */
var oauth2orize = require('oauth2orize'),
    authController = require('../app/controllers/auth');

var Oauth2Server = function Oauth2Server() {
  this.server = oauth2orize.createServer();

  this.initialize = function() {
    this.server.exchange(oauth2orize.exchange.password(authController.userPasswordExchange));
  };
};

Oauth2Server.instance = null;

Oauth2Server.getInstance = function() {
  if (this.instance === null) {
    this.instance = new Oauth2Server();
  }
  return this.instance;
};

module.exports = Oauth2Server.getInstance();