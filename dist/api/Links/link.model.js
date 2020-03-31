"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var LinkSchema = new _mongoose.default.Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String,
  clicks: {
    type: Number,
    default: 0
  },
  clickedBy: [{
    type: _mongoose.default.Types.ObjectId,
    ref: 'User',
    index: true,
    unique: true
  }]
}, {
  timestamps: true
});

var _default = _mongoose.default.model('Link', LinkSchema);

exports.default = _default;
//# sourceMappingURL=link.model.js.map
