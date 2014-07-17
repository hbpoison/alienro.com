var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

var app = express();

// db setup
var debug = require('debug')('alienro'),
    mongoose = require('mongoose'),
    db = require('./models');

db
  .sequelize
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      debug('Unable to connect to the database:', err);
    } else {
      debug('Successfully connected to mysql!');
    }
  });

mongoose.connect('mongodb://localhost:27017/alienro');

// view engine setup

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'EZMKEDbqofem3wEA3nNW',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());

/**
 * routes
 */
var loginController = require('./controllers/login'),
    userController = require('./controllers/user'),
    authController = require('./controllers/auth'),
    clientController = require('./controllers/client'),
    oauth2Controller = require('./controllers/oauth2'),
    router = express.Router();

// endpoint /logins
router.route('/logins')
  .post(authController.isAuthenticated, loginController.postLogin)
  .get(authController.isAuthenticated, loginController.getLogins);

// endpoint /logins/:account_id
router.route('/logins/:account_id')
  .get(authController.isAuthenticated, loginController.getLogin)
  .put(authController.isAuthenticated, loginController.putLogin)
  .delete(authController.isAuthenticated, loginController.deleteLogin);

// endpoint /users
router.route('/users')
  .post(userController.postUser)
  .get(authController.isAuthenticated, userController.getUsers);

// endpoint /users/:user_id
router.route('/users/:user_id')
  .get(authController.isAuthenticated, userController.getUser)
  .put(authController.isAuthenticated, userController.putUser)
  .delete(authController.isAuthenticated, userController.deleteUser);

// endpoint /clients
router.route('/clients')
  .post(authController.isAuthenticated, clientController.postClient)
  .get(authController.isAuthenticated, clientController.getClients);

// endpoint /oauth2/token
router.route('/oauth2/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token);

app.use('/', router);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
