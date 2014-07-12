var express = require('express');
var router = express.Router();
var db = require('../models');

router.route('/')
  // Get get all logins
  .get(function(req, res) {
    db.Login
      .findAll()
      .success(function(logins) {
        res.json({
          success : true,
          logins  : logins
        });
      })
      .error(function(err) {
        res.json({
          success : false,
          error   : err
        });
      });
  })
  // Post create new login
  .post(function(req, res) {
    db.Login
      .build(req.body)
      .save()
      .success(function(login) {
        res.json({
          success : true,
          login   : login
        });
      })
      .error(function(err) {
        res.json({
          success : false,
          error   : err
        });
      });
  });

router.route('/:account_id')
  // Get login
  .get(function(req, res) {
    db.Login
      .find(req.params.account_id)
      .success(function(login) {
        res.json({
          success : true,
          login   : login
        });
      })
      .error(function(err) {
        res.json({
          success : false,
          error   : err
        });
      });
  })
  .put(function(req, res) {
    db.Login
      .find(req.params.account_id)
      .success(function(login) {
        login.updateAttributes(req.body)
        .success(function() {
          res.json({
            success : true,
            login   : login
          });
        })
        .error(function(err) {
          res.json({
            success : false,
            error   : err
          });
        });
      })
      .error(function(err) {
        res.json({
          success : false,
          error   : err
        });
      });
  })
  .delete(function(req, res) {
    db.Login
      .find(req.params.account_id)
      .success(function(login) {
        login.destroy()
        .success(function() {
          res.json({ success: true });
        })
        .error(function(err) {
          res.json({
            success : false,
            error   : err
          });
        });
      })
      .error(function(err) {
        res.json({
          success : false,
          error   : err
        });
      });
  });

module.exports = router;