
var Client = require('../models/client');

/**
 * endpoint /api/clients POST
 */
exports.postClient = function(req, res) {
  // Create Client instance
  var client = new Client();

  // Set the client properties
  client.name = req.body.name;
  client.id = req.body.id;
  client.secret = req.body.secret;
  client.user = req.user._id;

  // Save client
  client.save(function(err) {
    if (err) {
      res.send(err);
    }
    res.json({
      message : 'Client added!',
      data    : client
    });
  });
};

/**
 * endpoint /api/clients GET
 */
exports.getClients = function(req, res) {
  // find all clients
  Client.find({
    user: req.user._id
  }, function(err, clients) {
    if (err) {
      res.send(err);
    }
    res.json(clients);
  });
};