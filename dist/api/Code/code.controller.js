"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;

var _link = _interopRequireDefault(require("../Links/link.model"));

var _lodash = _interopRequireDefault(require("lodash"));

function index(req, res) {
  var user = req.user;

  try {
    return _link.default.findOneAndUpdate({
      urlCode: req.params.code
    }, {
      $inc: {
        'clicks': 1
      },
      $addToSet: {
        clickedBy: user._id
      }
    }, {
      new: true
    }).then(linkFound => {
      return res.redirect(linkFound.longUrl);
    }).catch(err => {
      return res.status(404).json('No url found');
    });
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
}
//# sourceMappingURL=code.controller.js.map
