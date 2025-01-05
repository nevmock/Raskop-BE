"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertKeysToSnakeCase = void 0;
var _changeCase = require("change-case");
var convertKeysToSnakeCase = exports.convertKeysToSnakeCase = function convertKeysToSnakeCase(data) {
  return Object.keys(data).reduce(function (acc, key) {
    acc[(0, _changeCase.snakeCase)(key)] = data[key];
    return acc;
  }, {});
};