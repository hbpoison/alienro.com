'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    helmet = require('helmet'),
    passport = require('passport'),
    config = require('../config'),
    path = require('path');

module.exports = function() {
  // Initialize express app
  var app = express();

  // Globbing model files
  config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
    require(path.resolve(modelPath));
  });

  // compression
  app.use(compress({
    filter: function(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Showing stack errors
  app.enable('showStackError');

  // Env dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Enable logger
    app.use(morgan('dev'));
  }
  else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Enable jsonp
  app.enable('jsonp callback');

  // Passport
  app.use(passport.initialize());

  // Helmet
  app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.disable('x-powered-by');

  // Routing
  config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
    require(path.resolve(routePath))(app);
  });

  // Error handling
  app.use(function(err, req, res, next) {
    if (!err) return next();
    console.error(err.stack);
    res.send(500);
  });
  app.use(function(req, res) {
    res.send(404);
  });

  return app;
};