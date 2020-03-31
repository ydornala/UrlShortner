"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;

var _passport = _interopRequireDefault(require("passport"));

var _passportGoogleOauth = require("passport-google-oauth20");

function setup(User, config) {
  _passport.default.use(new _passportGoogleOauth.Strategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
  }, function (accessToken, refreshToken, profile, done) {
    User.findOne({
      'google.id': profile.id
    }).exec().then(user => {
      if (user) {
        return done(null, user);
      }

      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        username: profile.emails[0].value.split('@')[0],
        provider: 'google',
        google: profile
      });
      user.save().then(savedUser => done(null, savedUser)).catch(err => done(err));
    }).catch(err => done(err));
  }));
}
//# sourceMappingURL=passport.js.map
