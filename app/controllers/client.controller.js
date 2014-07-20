'use strict';

var mongoose = require('mongoose'),
    Client = mongoose.model('Client');

/**
 * Get error message from error object
 */
var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Client already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  }
  else {
    for (var errName in err.errors) {
      if (err.errors[errName].message)
        message = err.errors[errName].message;
    }
  }

  return message;
};

/**
 * endpoint /clients POST
 */
exports.add = function(req, res) {
  // Create Client instance
  var client = new Client({
    name   : req.body.name,
    secret : req.body.secret,
    user   : req.user._id
  });

  // Save client
  client.save(function(err) {
    if (err) {
      res.send(400, {
        message: getErrorMessage(err)
      });
    }

    res.jsonp(client);
  });
};

/**
 * endpoint /clients GET
 */
exports.getAll = function(req, res) {
  // find all clients
  Client.find({
    user: req.user._id
  }, function(err, clients) {
    if (err) {
      res.send(400, {
        message: getErrorMessage(err)
      });
    }

    res.json(clients);
  });
};