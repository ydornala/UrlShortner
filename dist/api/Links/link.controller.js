"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
exports.create = create;

var _link = _interopRequireDefault(require("./link.model"));

var _shortid = _interopRequireDefault(require("shortid"));

var _validUrl = _interopRequireDefault(require("valid-url"));

var _config = _interopRequireDefault(require("config"));

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
  var {
    longUrl
  } = req.body;

  var baseUrl = _config.default.get('baseUrl'); // Check base Url


  if (!_validUrl.default.isUri(baseUrl)) {
    return res.status(401).json('Invalid base Url');
  } // Create url Code


  var urlCode = _shortid.default.generate();

  if (_validUrl.default.isUri(longUrl)) {
    try {
      return _link.default.findOne({
        longUrl
      }).then(linkFound => {
        if (linkFound) {
          return res.json(linkFound);
        }

        return null;
      }).then(() => {
        var shortUrl = "".concat(baseUrl, "/").concat(urlCode);
        var url = {
          longUrl,
          shortUrl,
          urlCode
        };
        return _link.default.create(url).then(respondWithResult(res)).catch(handleError(res));
      });
    } catch (error) {
      res.status(401).json('Invalid long url');
    }
  }
}
//# sourceMappingURL=link.controller.js.map
