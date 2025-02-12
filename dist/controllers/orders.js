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
exports.shippingStatus = exports.getOneOrder = exports.getAllUserOrders = exports.getAllOrders = void 0;
const payment_1 = __importDefault(require("../models/payment"));
const customResponse_1 = require("../utils/customResponse");
const customErrors_1 = require("../errors/customErrors");
const http_status_codes_1 = require("http-status-codes");
const user_1 = require("../models/user");
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
const getAllUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_1.BaseUser.findById((_a = req.decoded) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            throw new customErrors_1.NotFound("User not found");
        }
        const order = yield payment_1.default.find({ owner: user.email }).sort({ _id: -1 });
        res.status(http_status_codes_1.StatusCodes.OK).json((0, customResponse_1.successResponse)(order, http_status_codes_1.StatusCodes.OK, "User orders"));
    }
    catch (error) {
        // Handle errors
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.getAllUserOrders = getAllUserOrders;
const getOneOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = yield payment_1.default.findOne({
            reference: req.body.reference
        });
        res.status(http_status_codes_1.StatusCodes.OK).json((0, customResponse_1.successResponse)(payment, http_status_codes_1.StatusCodes.OK, "Order fetched"));
    }
    catch (error) {
        // Handle errors
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.getOneOrder = getOneOrder;
const shippingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reference, deliveryMessage, deliveryStatus } = req.body;
        //if there's only message update only message
        if (deliveryMessage && reference) {
            const updatedPayment = yield payment_1.default.findOneAndUpdate({ reference }, { deliveryMessage }, { new: true });
            res.status(http_status_codes_1.StatusCodes.OK).json((0, customResponse_1.successResponse)(updatedPayment, http_status_codes_1.StatusCodes.OK, "Shipping status updated"));
            return;
        }
        if (!reference || !deliveryStatus) {
            throw new customErrors_1.BadRequest("Supply reference and deliveryStatus");
        }
        const currentTime = new Date().toLocaleString(); // Current timestamp
        const payment = yield payment_1.default.findOne({ reference });
        if (!payment) {
            throw new customErrors_1.BadRequest("Payment reference not found");
        }
        const existingStatusIndex = payment.deliveryTimeline.findIndex((entry) => entry.status === deliveryStatus);
        if (existingStatusIndex !== -1) {
            // If the status exists, update its time
            payment.deliveryTimeline[existingStatusIndex].time = currentTime;
        }
        else {
            // If the status does not exist, push a new object
            payment.deliveryTimeline.push({ status: deliveryStatus, time: currentTime });
        }
        // Update the deliveryStatus and deliveryMessage
        payment.deliveryStatus = deliveryStatus;
        // Save the changes
        yield payment.save();
        res.status(http_status_codes_1.StatusCodes.OK).json((0, customResponse_1.successResponse)(payment, http_status_codes_1.StatusCodes.OK, "Shipping status updated"));
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.shippingStatus = shippingStatus;
