'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Get error message from error object
 */
var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Username already exists';
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

// endpoint /user POST
exports.add = function(req, res) {
  var user = new User({
    username : req.body.username,
    password : req.body.password,
    email    : req.body.email
  });

  user.save(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    }

    res.jsonp(user);
  });
};

// endpoint /user GET
exports.get = function(req, res) {
  res.jsonp(req.user || null);
};

// endpoint /user PUT
exports.update = function(req, res) {
  var user = req.user;

  if (!user) {
    return res.send(400, {
      message: 'Not signed in'
    });
  }

  if (req.body.newPassword) {
    if (!user.authenticate(req.body.password)) {
      return res.send(400, {
        message: 'Password is incorrect'
      });
    }

    if (req.body.newPassword !== req.body.verifyPassword) {
      return res.send(400, {
        message: 'Password do not match'
      });
    }
      
    user.password = req.body.newPassword;
  }

  if (req.body.email)
    user.email = req.body.email;

  user.updated = Date.now();

  user.save(function(err) {
    if (err) {
      res.send(400, {
        message: getErrorMessage(err)
      });
    }
    else {
      res.jsonp(user);
    }
  });
};
