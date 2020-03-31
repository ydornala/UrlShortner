"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var auth = _interopRequireWildcard(require("../../auth/auth.service"));

var express = require('express');

var controller = require('./link.controller');

var router = express.Router();
router.get('/', auth.isAuthenticated(), controller.index);
router.post('/', auth.isAuthenticated(), controller.create);
module.exports = router;
//# sourceMappingURL=index.js.map
