"use strict";

var mongoose = require('mongoose');

var User = mongoose.Schema({
  name: String,
  email: String,
  username: String,
  provider: String,
  google: {},
  facebook: {}
}, {
  timestamps: true
});
module.exports = mongoose.model('User', User);
//# sourceMappingURL=User.model.js.map
