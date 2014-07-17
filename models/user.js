/**
 * User model definition
 */

/** Dependencies */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');

/**
 * User model schema
 * @type {Schema}
 */
var UserSchema = new Schema({
  name: {
    type    : String,
    unique  : true,
    require : true
  },
  password: {
    type    : String,
    require : true
  },
  email: {
    type    : String,
    require : true
  },
  groupId: {
    type    : Number,
    require : true,
    default : 0
  },
  gameLogins: {
    type    : [Number],
    default : []
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
      return next(err)
    };

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
UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

UserSchema.methods.findGameLogin = function(account_id, callback) {
  var idx = this.gameLogins.indexOf(account_id);
  callback(idx);
};

UserSchema.methods.removeGameLogin = function(account_id) {
  this.findGameLogin(account_id, function(idx) {
    if (idx >= 0)
      this.indexGameLogin.splice(idx, 1);
  });
};

// Export User model
module.exports = mongoose.model('User', UserSchema);
