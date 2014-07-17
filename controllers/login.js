
var db = require('../models');

exports.postLogin = function(req, res) {
  db.Login
    .build(req.body)
    .save()
    .success(function(login) {
      req.user.gameLogins.push(login.account_id);
      req.user.save(function(err) {
        if (err)
          res.send(err);

        res.json({
          message: 'Login added',
          data: login
        });
      });
    });
};

exports.getLogins = function(req, res) {
  db.Login
    .findAll({
      where: { account_id: req.user.gameLogins }
    })
    .success(function(logins) {
      res.json(logins);
    });
};

exports.getLogin = function(req, res) {
  req.user.findGameLogin(req.params.account_id, function(idx) {
    if (idx < 0)
      res.send(403);
    else {
      db.Login
        .find(req.params.account_id)
        .success(function(login) {
          if (!login)
            res.send(404);
          else
            res.json(login);
        });
    }
  });
};

exports.putLogin = function(req, res) {
  req.user.findGameLogin(req.params.account_id, function(idx) {
    if (idx < 0)
      res.send(403);
    else {
      db.Login
        .find(req.params.account_id)
        .success(function(login) {
          if (!login)
            res.send(404);
          else {
            login.updateAttributes(req.body)
            .success(function() {
              res.json({
                message: 'Login updated!',
                data: login
              });
            });
          }
        });
    }
  });
};

exports.deleteLogin = function(req, res) {
  req.user.findGameLogin(req.params.account_id, function(idx) {
    if (idx < 0)
      res.send(403);
    else {
      db.Login
        .find(req.params.account_id)
        .success(function(login) {
          if (!login)
            res.send(404);
          else {
            login.destroy().success(function() {
              req.user.removeGameLogin(req.params.account_id);
              res.json({
                message: 'Login deleted!'
              });
            });
          }
        });
    }
  });
};
    