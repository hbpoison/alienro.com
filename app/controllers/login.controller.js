'use strict';

/**
 * Module dependencies.
 */

var mysqlOrm = require('../../config/sequelize'),
    Login = mysqlOrm.model('Login');

exports.add = function(req, res) {
  Login.build({
    userid    : req.body.username,
    user_pass : req.body.password,
    sex       : req.body.sex,
    email     : req.body.email,
    birthdate : req.body.birthDate
  }).save().success(function(login) {
    req.user.gameAccounts.push(login.account_id);

    req.user.save(function(err) {
      if (err) {
        return res.send(400, {
          message: 'Failed to attach login to user'
        });
      }

      res.jsonp(login);
    });
  });
};

exports.getAll = function(req, res) {
  Login.findAll({
    where: { account_id: req.user.gameAccounts }
  }).success(function(logins) {
    res.jsonp(logins);
  });
};

exports.getById = function(req, res, next, id) {
  Login.find(id).success(function(login) {
    if (!login) {
      return next(new Error('Login not exists'));
    }

    req.gameAccount = login;
    next();
  });
};

exports.getByUsername = function(req, res, next, username) {
  Login.find({
    where: { userid: username }
  }).success(function(login) {
    if (!login) {
      return next(new Error('Login not exists'));
    }

    req.gameAccount = login;
    next();
  });
};

exports.get = function(req, res) {
  req.user.findGameAccount(req.gameAccount.account_id, function(idx) {
    if (idx < 0) {
      return res.send(403, {
        message: 'Not authorized'
      });
    }

    res.jsonp(req.gameAccount);
  });
};

exports.update = function(req, res) {
  var login = req.gameAccount;

  req.user.findGameLogin(login.account_id, function(idx) {
    if (idx < 0) {
      return res.send(403, {
        message: 'Not authorized'
      });
    }

    if (req.body.newPassword) {
      if (!login.authenticate(req.body.password)) {
        return res.send(400, {
          message: 'password is incorrect'
        });
      }

      if (req.body.newPassword !== req.body.verifyPassword) {
        return res.send(400, {
          message: 'password do not match'
        });
      }

      login.user_pass = req.body.newPassword;
    }

    if (req.body.email)
      login.email = req.body.email;

    login.save().success(function(account) {
      res.jsonp(account);
    });
  });
};

exports.attach = function(req, res) {
  var login = req.gameAccount;

  req.user.findGameLogin(login.account_id, function(idx) {
    if (idx >= 0) {
      return res.send(400, {
        message: 'Already attached'
      });
    }

    if (!login.authenticate(req.body.password)) {
      return res.send(400, {
        message: 'password is incorrect'
      });
    }

    req.user.gameAccounts.push(login.account_id);

    req.user.save(function(err) {
      if (err) {
        return res.send(400, {
          message: 'Failed to attach login to user'
        });
      }

      res.jsonp(login);
    });
  });
};