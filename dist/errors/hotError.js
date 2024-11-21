"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotError = void 0;
const http_status_codes_1 = require("http-status-codes");
const customErrors_1 = require("./customErrors");
const hotError = (error, res) => {
    console.error(error);
    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
        .json(new customErrors_1.InternalServerError(error.message));
};
exports.hotError = hotError;
