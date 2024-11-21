"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = exports.BadRequest = exports.Conflict = exports.InternalServerError = exports.Unauthenticated = void 0;
const http_status_codes_1 = require("http-status-codes");
const capitalize = (content) => {
    return String(content).charAt(0).toUpperCase() + String(content).slice(1);
};
class BaseError extends Error {
    constructor(message, statusCode, status, code, reason) {
        super(message);
        this.status = status;
        this.statusCode = statusCode;
        this.code = code;
        this.reason = capitalize(reason);
    }
}
// Specific error classes extending the base class
class BadRequest extends BaseError {
    constructor(message = 'Bad Request', status = 'error', code = 'BAD_REQUEST', reason = message) {
        super(message, http_status_codes_1.StatusCodes.BAD_REQUEST, code, status, reason);
    }
}
exports.BadRequest = BadRequest;
class NotFound extends BaseError {
    constructor(message = 'Not Found', status = 'error', code = 'NOT_FOUND', reason = message) {
        super(message, http_status_codes_1.StatusCodes.NOT_FOUND, code, status, reason);
    }
}
exports.NotFound = NotFound;
class Unauthenticated extends BaseError {
    constructor(message = 'Unauthorized', status = 'error', code = 'UNAUTHORIZED', reason = message) {
        super(message, http_status_codes_1.StatusCodes.UNAUTHORIZED, code, status, reason);
    }
}
exports.Unauthenticated = Unauthenticated;
class InternalServerError extends BaseError {
    constructor(message = 'Internal Server Error', status = 'error', code = 'INTERNAL_SERVER_ERROR', reason = message) {
        super(message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, code, status, reason);
    }
}
exports.InternalServerError = InternalServerError;
class Conflict extends BaseError {
    constructor(message = 'Conflict', status = 'error', code = 'CONFLICT', reason = message) {
        super(message, http_status_codes_1.StatusCodes.CONFLICT, code, status, reason);
    }
}
exports.Conflict = Conflict;
