
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TokenSchema = new mongoose.Schema({
  value: {
    type    : String,
    require : true
  },
  user: {
    type    : Schema.ObjectId,
    ref     : 'User',
    require : true
  },
  client: {
    type    : Schema.ObjectId,
    ref     : 'Client',
    require : true
  }
});

module.exports = mongoose.model('Token', TokenSchema);