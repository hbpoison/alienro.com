'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * [ClientSchema description]
 * @type {Schema}
 */
var ClientSchema = new Schema({
  name: {
    type     : String,
    unique   : true,
    trim     : true,
    required : true
  },
  secret: {
    type     : String,
    trim     : true,
    required : true
  },
  user: {
    type : Schema.Types.ObjectId,
    ref  : 'User'
  }
});

mongoose.model('Client', ClientSchema);
