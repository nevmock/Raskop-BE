class BaseError extends Error {
    constructor(errorCode, statusCode, message) {
        super(message);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}

export default BaseError;