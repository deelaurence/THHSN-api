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
exports.getAllOrders = void 0;
const payment_1 = __importDefault(require("../models/payment"));
const customResponse_1 = require("../utils/customResponse");
const customErrors_1 = require("../errors/customErrors");
const http_status_codes_1 = require("http-status-codes");
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield payment_1.default.find().sort({ _id: -1 });
        res.status(http_status_codes_1.StatusCodes.OK).json((0, customResponse_1.successResponse)(payments, http_status_codes_1.StatusCodes.OK, "List of all payments"));
    }
    catch (error) {
        // Handle errors
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.getAllOrders = getAllOrders;
