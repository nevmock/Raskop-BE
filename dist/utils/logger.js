"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _winston = require("winston");
var timestamp = _winston.format.timestamp,
  combine = _winston.format.combine,
  printf = _winston.format.printf,
  errors = _winston.format.errors;
function logger() {
  var logFormat = printf(function (_ref) {
    var level = _ref.level,
      message = _ref.message,
      timestamp = _ref.timestamp,
      stack = _ref.stack;
    return "".concat(timestamp, " ").concat(level, ": ").concat(stack || message);
  });
  return (0, _winston.createLogger)({
    format: combine(_winston.format.colorize(), timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }), errors({
      stack: true
    }), logFormat),
    transports: [new _winston.transports.Console()]
  });
}
var _default = exports["default"] = logger();