'use strict';

module.exports = function(app) {
  var auth = require('../../app/controllers/auth');

  app.route('/oauth2/token')
    .post(auth.clientAuthenticated, auth.token);
};