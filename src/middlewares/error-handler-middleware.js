const logger = require("../utils/logger");
const BaseError = require("../base_classes/base-error");
const StatusCodes = require("../errors/status-codes");
const { INVALID_CREDENTIALS, SERVER_PROBLEM } = require("../errors/error-codes");

const errorHandler = (err, _req, res, _next) => {
  const statusCode = Object.values(StatusCodes).find((code) => code.message === err.statusCode);

  if (err.name === "ValidationError") {
    const errorObj = {};

    for (const error of err.details) {
      errorObj[error.path] = [error.message];
    }

    return res.status(StatusCodes.BAD_REQUEST.code).json({
      code: 400,
      status: StatusCodes.BAD_REQUEST.message,
      errors: errorObj,
    });
  }

  //   if (err.name == "SequelizeValidationError") {
  //     return res.status(400).json(err);
  //   }

  if (err instanceof BaseError) {
    console.error(err);
    return res.status(statusCode.code).json({
      code: err.errorCode,
      status: err.statusCode,
      errors: {
        message: err.message,
      },
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER.code).json({
    code: 500,
    status: StatusCodes.INTERNAL_SERVER.message,
    errors: {
      message: err.message,
    },
  });
};

module.exports = errorHandler;
