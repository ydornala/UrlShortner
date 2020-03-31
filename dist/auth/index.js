"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var express = require('express');

var User = require('../api/User/User.model');

var router = express.Router();

var Config = require('../config/environment');

require('./google/passport').setup(User, Config);

router.use('/google', require('./google').default);
var _default = router;
exports.default = _default;
//# sourceMappingURL=index.js.map
