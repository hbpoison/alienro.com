'use strict';

/**
 * Module dependencies
 */
require('./config/init')();

var config = require('./config'),
    mongoose = require('mongoose'),
    mysqlOrm = require('./config/sequelize');

// Bootstrap databases connection
mongoose.connect(config.db);
mysqlOrm.initialize();
mysqlOrm.authenticate(function(err) {
  if (err) console.log('Unable to connect to mysql:', err);
  else console.log('Successfully connected to mysql.');
});

// Init the express application
var app = require('./config/express')();

// Bootstrap auth config
require('./config/passport')();
require('./config/oauth2').initialize();

app.listen(config.port);


exports = module.exports = app;

console.log('AlienRO application started on port ' + config.port + '.');
