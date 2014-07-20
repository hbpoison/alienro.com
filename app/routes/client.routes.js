'use strict';

module.exports = function(app) {
  var clients = require('../../app/controllers/client'),
      auth = require('../../app/controllers/auth');

  app.route('/clients')
    .get(auth.authenticated, clients.getAll)
    .post(auth.authenticated, clients.add);
};