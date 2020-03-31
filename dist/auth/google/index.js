"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _auth = require("../auth.service");

var express = require('express');

var passport = require('passport');

var router = express.Router();
router.get('/', passport.authenticate('google', {
  failureRedirect: '/register',
  scope: ['profile', ' email'],
  session: false
})).get('/callback', passport.authenticate('google', {
  failureRedirect: 'register',
  session: false
}), _auth.setTokenCookie);
var _default = router;
exports.default = _default;
//# sourceMappingURL=index.js.map
