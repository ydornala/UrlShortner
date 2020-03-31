"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _passport = _interopRequireDefault(require("passport"));

var express = require('express');

var mongoose = require('mongoose');

var config = require('./config/environment');

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var {
  SERVE_HOSTNAME,
  SERVE_PORT
} = require('../src/config.json');

var cookieSession = require('cookie-session');

var {
  v4: uuid
} = require('uuid'); // require('dotenv-safe').config({
//   allowEmptyValues: true
// });


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(config.mongo.uri, {
  useNewUrlParser: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.log('Failed to connect to MongoDB', err));
var app = express();
app.use(cookieParser());
app.use(_passport.default.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieSession({
  name: 'shortlinks',
  keys: [process.env.SESHSECRET],
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days

}));
app.use(function (req, res, next) {
  req.session.id = req.session.id || uuid();
  res.header('Access-Control-Allow-Origin', '*');
  next(); // pass control to the next handler
});
app.use('/', require('./api/Code'));
app.use('/api/links', require('./api/Links'));
app.use('/auth', require('./auth').default);
app.listen(SERVE_PORT, SERVE_HOSTNAME, () => console.log("Shortlinks backend listening on ".concat(SERVE_HOSTNAME, ":").concat(SERVE_PORT, "!")));
//# sourceMappingURL=index.js.map
