
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClientSchema = new Schema({
  name: {
    type    : String,
    unique  : true,
    require : true
  },
  secret: {
    type    : String,
    require : true
  },
  user: {
    type    : Schema.Types.ObjectId,
    ref     : 'User'
  }
});

// export the client model
module.exports = mongoose.model('Client', ClientSchema);
