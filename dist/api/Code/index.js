"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var auth = _interopRequireWildcard(require("../../auth/auth.service"));

var express = require('express');

var controller = require('./code.controller');

var router = express.Router();
router.get('/:code', auth.isAuthenticated(), controller.index);
module.exports = router;
//# sourceMappingURL=index.js.map
