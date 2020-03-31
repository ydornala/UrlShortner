"use strict";

var express = require('express');

var mongoose = require('mongoose');

var config = require('./config/environment');

var bodyParser = require('body-parser');

var _require = require('../src/config.json'),
    SERVE_HOSTNAME = _require.SERVE_HOSTNAME,
    SERVE_PORT = _require.SERVE_PORT;

var cookieSession = require('cookie-session');

var _require2 = require('uuid'),
    uuid = _require2.v4; // require('dotenv-safe').config({
//   allowEmptyValues: true
// });


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
console.log('conf', config);
mongoose.connect(config.mongo.uri, {
  useNewUrlParser: true
}).then(function () {
  return console.log('Connected to MongoDB');
}).catch(function (err) {
  return console.log('Failed to connect to MongoDB', err);
});
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieSession({
  name: 'shortlinks',
  keys: [process.env.SESHSECRET],
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days

}));
app.use(function (req, res, next) {
  console.log("".concat(req.method, " ").concat(req.url));
  req.session.id = req.session.id || uuid();
  res.header('Access-Control-Allow-Origin', '*');
  next(); // pass control to the next handler
});
app.use('/', require('./api/Code'));
app.use('/api/links', require('./api/Links'));
app.use('/auth', require('./auth').default);
app.listen(SERVE_PORT, SERVE_HOSTNAME, function () {
  return console.log("Shortlinks backend listening on ".concat(SERVE_HOSTNAME, ":").concat(SERVE_PORT, "!"));
});
"use strict";

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    _User.default.findById(req.user._id).exec().then(function (user) {
      if (!user) {
        return res.status(401).end();
      }

      req.user = user;
      next();
      return null;
    }).catch(function (err) {
      return next(err);
    });
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
  res.redirect('/');
}
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
  session: true
})).get('/callback', passport.authenticate('google', {
  failureRedirect: 'register',
  session: true
}), _auth.setTokenCookie);
var _default = router;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;

var _passport = _interopRequireDefault(require("passport"));

var _passportGoogleOauth = require("passport-google-oauth20");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setup(User, config) {
  _passport.default.use(new _passportGoogleOauth.Strategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
  }, function (accessToken, refreshToken, profile, done) {
    User.findOne({
      'google.id': profile.id
    }).exec().then(function (user) {
      if (user) {
        return done(null, user);
      }

      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        username: profile.emails[0].value.split('@')[0],
        provider: 'google',
        google: profile._json
      });
      user.save().then(function (savedUser) {
        return done(null, savedUser);
      }).catch(function (err) {
        return done(err);
      });
    }).catch(function (err) {
      return done(err);
    });
  }));
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;

var _link = _interopRequireDefault(require("../Links/link.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function index(req, res) {
  try {
    return _link.default.findOne({
      urlCode: req.params.code
    }).then(function (linkFound) {
      return res.redirect(linkFound.longUrl);
    }).catch(function (err) {
      return res.status(404).json('No url found');
    });
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
}
"use strict";

var express = require('express');

var controller = require('./code.controller');

var router = express.Router();
router.get('/:code', controller.index);
module.exports = router;
"use strict";

var express = require('express');

var controller = require('./link.controller');

var router = express.Router();
router.get('/', controller.index);
router.post('/', controller.create);
module.exports = router;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
exports.create = create;

var _link = _interopRequireDefault(require("./link.model"));

var _shortid = _interopRequireDefault(require("shortid"));

var _validUrl = _interopRequireDefault(require("valid-url"));

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }

    return null;
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }

    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

function index(req, res) {
  return _link.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

function create(req, res) {
  var longUrl = req.body.longUrl;

  var baseUrl = _config.default.get('baseUrl'); // Check base Url


  if (!_validUrl.default.isUri(baseUrl)) {
    return res.status(401).json('Invalid base Url');
  } // Create url Code


  var urlCode = _shortid.default.generate();

  if (_validUrl.default.isUri(longUrl)) {
    try {
      return _link.default.findOne({
        longUrl: longUrl
      }).then(function (linkFound) {
        if (linkFound) {
          return res.json(linkFound);
        }

        return null;
      }).then(function () {
        var shortUrl = "".concat(baseUrl, "/").concat(urlCode);
        var url = {
          longUrl: longUrl,
          shortUrl: shortUrl,
          urlCode: urlCode
        };
        return _link.default.create(url).then(respondWithResult(res)).catch(handleError(res));
      });
    } catch (error) {
      res.status(401).json('Invalid long url');
    }
  }
}
"use strict";

var mongoose = require('mongoose');

var LinkSchema = new mongoose.Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String
}, {
  timestamps: true
});
module.exports = mongoose.model('Link', LinkSchema);
"use strict";
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
"use strict";
"use strict";

module.exports = {
  mongo: {
    uri: process.env.MONGOEB_URI || 'mongodb+srv://admin:admin123@cluster0-04u6e.mongodb.net/shortlinks?retryWrites=true&w=majority'
  }
};
"use strict";

var _ = require('lodash');

var all = {
  env: process.env.NODE_ENV,
  clientPort: process.env.CLIENT_PORT,
  port: process.env.PORT || 5000,
  baseUrl: 'http://localhost:5000',
  secrets: {
    session: 'documents-secret'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '694752243466-8dnn58v4majnii5cmb6f5tlr74bce1tu.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'ETQd4Nxus7zDG-B_GcLes1Ui',
    callbackURL: "".concat(process.env.DOMAIN || '', "/auth/google/callback")
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL: "".concat(process.env.DOMAIN || '', "/auth/facebook/callback")
  }
};
module.exports = _.merge(all, require("./".concat(process.env.NODE_ENV || 'development', ".js")) || {});
"use strict";

module.exports = {
  mongo: {
    uri: process.env.MONGOEB_URI
  }
};
//# sourceMappingURL=all.js.map
