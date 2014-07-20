'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * [TokenSchema description]
 * @type {mongoose}
 */
var TokenSchema = new mongoose.Schema({
  value: {
    type     : String,
    required : true
  },
  user: {
    type     : Schema.ObjectId,
    ref      : 'User',
    required : true
  },
  client: {
    type     : Schema.ObjectId,
    ref      : 'Client',
    required : true
  }
});

mongoose.model('Token', TokenSchema);