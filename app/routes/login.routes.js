'use strict';

module.exports = function(app) {
  var logins = require('../../app/controllers/login'),
      auth = require('../../app/controllers/auth');

  app.route('/logins')
    .post(auth.authenticated, logins.add)
    .get(auth.authenticated, logins.getAll);

  app.param('account_id', logins.getById);
  app.param('userid', logins.getByUsername);

  app.route('/logins/:account_id')
    .get(auth.authenticated, logins.get)
    .put(auth.authenticated, logins.update)
    .post(auth.authenticated, logins.attach);

  app.route('/logins/:userid')
    .get(auth.authenticated, logins.get)
    .put(auth.authenticated, logins.update)
    .post(auth.authenticated, logins.attach);
};