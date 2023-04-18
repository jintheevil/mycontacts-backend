const { constants } = require('../constants');

class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}
// Handles error based on status code passed
const handleError = (err, req, res, next) => {
    const statusCode = err.statusCode ? err.statusCode : 500;

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.status(statusCode).json({
                errorCode: statusCode,
                title: 'Validation Failed',
                message: err.message,
                stackTrace: err.stack,
            });
            break;

        case constants.BAD_REQUEST_ERROR:
            res.status(statusCode).json({
                errorCode: statusCode,
                title: 'Bad Request',
                message: err.message,
                stackTrace: err.stack,
            });
            break;

        case constants.METHOD_ERROR:
            res.status(statusCode).json({
                errorCode: statusCode,
                title: 'Method not supported',
                message: err.message,
                stackTrace: err.stack,
            });
            break;

        case constants.UNAUTH_ERROR:
            res.status(statusCode).json({
                errorCode: statusCode,
                title: 'Unauthorised',
                message: err.message,
                stackTrace: err.stack,
            });
            break;

        case constants.FORBIDDEN_ERROR:
            res.status(statusCode).json({
                errorCode: statusCode,
                title: 'Forbidden',
                message: err.message,
                stackTrace: err.stack,
            });
            break;

        default:
            res.status(statusCode).json({
                errorCode: statusCode,
                status: 'error',
                message: err.message || 'Internal Server Error',
                stackTrace: err.stack,
            });
    }
};

module.exports = { ErrorHandler, handleError };