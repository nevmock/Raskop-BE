"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var validateCredentials = function validateCredentials(schema) {
  return function (req, res, next) {
    var validated = schema.validate(req.body, {
      abortEarly: false,
      errors: {
        wrap: {
          label: ''
        }
      },
      convert: true
    });
    if (validated.error) {
      next(validated.error);
    } else {
      next();
    }
  };
};
var _default = exports["default"] = validateCredentials;