"use strict";

var _app = _interopRequireDefault(require("./app.js"));
var _logger = _interopRequireDefault(require("./utils/logger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var PORT = process.env.PORT || 3000;
var app = new _app["default"](PORT);
var server = app.start();
process.on("SIGTERM", function () {
  _logger["default"].warn('SIGTERM RECIEVED!');
  server.close(function () {
    _logger["default"].warn('Process Terminated!');
  });
});