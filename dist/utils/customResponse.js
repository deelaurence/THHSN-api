"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = void 0;
const successResponse = (payload, statusCode, message) => {
    return {
        status: "success",
        message,
        statusCode,
        payload
    };
};
exports.successResponse = successResponse;
