"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createdResponse = createdResponse;
exports.successResponse = successResponse;
var _statusCodes = _interopRequireDefault(require("../errors/status-codes.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * Success response for successful operations
 * @param {any} data - The data to return in the response
 * @param {string} message - Success message
 * @returns {object} - Formatted success response
 */
function successResponse(res) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Request successful";
  var recordsTotal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return res.status(_statusCodes["default"].OK.code).json({
    code: _statusCodes["default"].OK.code,
    status: _statusCodes["default"].OK.message,
    recordsTotal: recordsTotal == null ? Array.isArray(data) ? data.length : 1 : recordsTotal,
    data: data,
    errors: null
  });
}

/**
 * Created response for resource creation
 * @param {any} data - The newly created resource
 * @param {string} message - Success message
 * @returns {object} - Formatted created response
 */
function createdResponse(res) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Resource created successfully";
  var recordsTotal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return res.status(_statusCodes["default"].CREATED.code).json({
    code: _statusCodes["default"].CREATED.code,
    status: _statusCodes["default"].CREATED.message,
    recordsTotal: recordsTotal == null ? Array.isArray(data) ? data.length : 1 : recordsTotal,
    data: data,
    errors: null
  });
}