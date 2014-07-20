'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');

/**
 * Validation function for password
 */
var validatePassword = function(password) {
  return (password && password.length > 6);
};

/**
 * User model schema
 * @type {Schema}
 */
var UserSchema = new Schema({
  username: {
    type     : String,
    unique   : true,
    required : 'Please fill in a username',
    trim     : true
  },
  password: {
    type     : String,
    default  : '',
    validate : [validatePassword, 'Password should be longer']
  },
  email: {
    type     : String,
    trim     : true,
    default  : '',
    required : 'Please fillin your email',
    match    : [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  roles: {
    type    : [{
      type: String,
      enum: ['user', 'superuser', 'admin']
    }],
    default : ['user']
  },
  gameAccounts: {
    type    : [Number],
    default : []
  },
  updated: {
    type: Date
  }
});

/**
 * Password encryption
 */
UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(5, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password using new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

/**
 * Password candidation
 * @param  {String}   candidatePassword
 * @param  {Function} cb
 */
UserSchema.methods.authenticate = function(password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * [findGameAccount description]
 * @param  {[type]}   account_id [description]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */
UserSchema.methods.findGameAccount = function(account_id, callback) {
  var idx = this.gameAccounts.indexOf(account_id);
  callback(idx);
};

mongoose.model('User', UserSchema);
