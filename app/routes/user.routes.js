'use strict';

module.exports = function(app) {
  var user = require('../../app/controllers/user'),
      auth = require('../../app/controllers/auth');
      
  app.route('/user')
    .get(auth.authenticated, user.get)
    .put(auth.authenticated, user.update)
    .post(auth.clientAuthenticated, user.add);
};