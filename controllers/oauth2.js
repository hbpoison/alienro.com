/**
 * Dependencies
 */
var oauth2orize = require('oauth2orize'),
    crypto = require('crypto'),
    User = require('../models/user'),
    Client = require('../models/client'),
    Token = require('../models/token');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

// register serialialization and deserialization functions
server.serializeClient(function(client, callback) {
  return callback(null, client._id);
});

server.deserializeClient(function(id, callback) {
  Client.findById(id, function(err, client) {
    if (err)
      return callback(err);
    return callback(null, client);
  });
});

server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, callback){
  User.findOne({ name: username }, function(err, user) {
    if (err)
      return callback(err);
    if (!user)
      return callback(null, false);
    user.verifyPassword(password, function(err, isMatch) {
      if (err)
        return callback(err);
      if (!isMatch)
        return callback(null, false);

      // delete used tokens
      Token.remove({
        user: user._id,
        client: client._id
      }, function(err) {
        if (err)
          return callback(err);

        var token = new Token({
          value: crypto.randomBytes(32).toString('base64'),
          client: client._id,
          user: user._id
        });

        token.save(function(err) {
          if (err)
            return callback(err);
          callback(null, token);
        })
      })
    });
  });
}));

exports.token = [
  server.token(),
  server.errorHandler()
];

/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
function uid (len) {
  var buf = [],
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
}

/**
 * Return a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
