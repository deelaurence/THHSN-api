"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const dotenv_1 = require("dotenv");
const customErrors_1 = require("../errors/customErrors");
// Load environment variables
(0, dotenv_1.configDotenv)();
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('auth start');
        let token = null;
        // Check for token in headers
        const { authorization } = req.headers;
        if (authorization && authorization.startsWith('Bearer ')) {
            token = authorization.split(' ')[1];
        }
        // If no token is provided
        if (!token) {
            throw new customErrors_1.Unauthenticated('Token not provided');
        }
        // Verify the token
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Attach decoded payload to the request object
        req.decoded = { name: payload.name, id: payload.id };
        console.log('auth end, next');
        next();
    }
    catch (error) {
        console.log('auth error:', error);
        // Handle JWT-specific errors like TokenExpiredError or JsonWebTokenError
        if (error.name === 'TokenExpiredError') {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json(new customErrors_1.Unauthenticated('Token has expired'));
        }
        else if (error.name === 'JsonWebTokenError') {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json(new customErrors_1.Unauthenticated('Invalid token'));
        }
        // If the error has a custom statusCode, use it; otherwise, default to 401
        const statusCode = error.statusCode || http_status_codes_1.StatusCodes.UNAUTHORIZED;
        const message = error.message || 'Authentication failed';
        return res.status(statusCode).json(new customErrors_1.Unauthenticated(message));
    }
});
exports.default = auth;
