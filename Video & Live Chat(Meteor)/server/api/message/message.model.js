'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  body: String, 
  from: {type: Schema.ObjectId, ref: 'User'},
  to: {type: Schema.ObjectId, ref: 'User'},
  timestamp: {type: Date},
  type: String,
  _partnership: {type: Schema.ObjectId, ref: 'Partnership'},
  seen: {type: Boolean, default: false}
});

module.exports = mongoose.model('Message', MessageSchema);