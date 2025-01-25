import statusCodes from "../errors/status-codes.js";
class BaseError extends Error {
  constructor(errorCode, statusCode, errorName, message) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errorName = errorName;
  }
  static notFound(message = "Resource does not exist") {
    return new BaseError(statusCodes.NOT_FOUND.code, statusCodes.NOT_FOUND.message, "Resource Not Found", message);
  }
}
export default BaseError;