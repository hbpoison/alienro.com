/**
 * Dependencies
 */

var User = require('../models/user');

// endpoint /users POST
exports.postUser = function(req, res) {
  var user = new User({
    name     : req.body.name,
    password : req.body.password,
    email    : req.body.email
  });

  user.save(function(err) {
    if (err)
      res.send(err);

    res.json({
      message : 'User added!',
      data    : user
    });
  });
};

// endpoint /users GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json(users);
  });
};

// endpoint /users/:user_id GET
exports.getUser = function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (err)
      res.send(err);

    res.json(user);
  });
};

// endpoint /users/:user_id PUT
exports.putUser = function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (err)
      res.send(err);

    if (req.body.password)
      user.password = req.body.password;
    if (req.body.email)
      user.email = req.body.email;

    user.save(function(err) {
      if (err)
        res.send(err);

      res.json({
        message: 'User updated!',
        data: user
      });
    });
  });
};

// endpoint /users/:user_id DELETE
exports.deleteUser = function(req, res) {
  User.findByIdAndRemove(req.params.user_id, function(err) {
    if (err)
      res.send(err);

    res.json({
      message: 'User deleted!'
    });
  });
};
