"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAuthenticated = isAuthenticated;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;

var _environment = _interopRequireDefault(require("../config/environment"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _expressJwt = _interopRequireDefault(require("express-jwt"));

var _composableMiddleware = _interopRequireDefault(require("composable-middleware"));

var _User = _interopRequireDefault(require("../api/User/User.model"));

var validateJwt = (0, _expressJwt.default)({
  secret: _environment.default.secrets.session
});

function isAuthenticated() {
  return (0, _composableMiddleware.default)().use(function (req, res, next) {
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = "Bearer ".concat(req.query.access_token);
    }

    if (req.query && typeof req.headers.authorization === 'undefined') {
      req.headers.authorization = "Bearer ".concat(req.cookies.token);
    }

    validateJwt(req, res, next);
  }).use(function (req, res, next) {
    _User.default.findById(req.user._id).exec().then(user => {
      if (!user) {
        return res.status(401).end();
      }

      req.user = user;
      next();
      return null;
    }).catch(err => next(err));
  });
}

function signToken(id, role) {
  return _jsonwebtoken.default.sign({
    _id: id
  }, _environment.default.secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}

function setTokenCookie(req, res) {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }

  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', token);
  res.redirect('/success?access_token=' + token);
}
//# sourceMappingURL=auth.service.js.map
