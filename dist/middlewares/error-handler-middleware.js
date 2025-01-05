"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorHandler = exports["default"] = void 0;
var _logger = _interopRequireDefault(require("../utils/logger.js"));
var _baseError = _interopRequireDefault(require("../base_classes/base-error.js"));
var _statusCodes = _interopRequireDefault(require("../errors/status-codes.js"));
var _errorCodes = require("../errors/error-codes.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var errorHandler = exports.errorHandler = function errorHandler(err, _req, res, _next) {
  var statusCode = Object.values(_statusCodes["default"]).find(function (code) {
    return code.message === err.statusCode;
  });
  if (err.name === "ValidationError") {
    var errorObj = {};
    var _iterator = _createForOfIteratorHelper(err.details),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var error = _step.value;
        errorObj[error.path] = [error.message];
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return res.status(_statusCodes["default"].BAD_REQUEST.code).json({
      code: 400,
      status: _statusCodes["default"].BAD_REQUEST.message,
      recordsTotal: 0,
      data: null,
      errors: {
        name: err.name,
        message: err.message,
        validation: errorObj
      }
    });
  }

  //   if (err.name == "SequelizeValidationError") {
  //     return res.status(400).json(err);
  //   }

  if (err instanceof _baseError["default"]) {
    console.error(err);
    return res.status(statusCode.code).json({
      code: err.errorCode,
      status: err.statusCode,
      recordsTotal: 0,
      data: null,
      errors: {
        name: err.errorName,
        message: err.message,
        validation: null
      }
    });
  }
  console.error(err);
  return res.status(_statusCodes["default"].INTERNAL_SERVER.code).json({
    code: 500,
    status: _statusCodes["default"].INTERNAL_SERVER.message,
    recordsTotal: 0,
    data: null,
    errors: {
      name: err.name,
      message: err.message,
      validation: null
    }
  });
};
var _default = exports["default"] = errorHandler;