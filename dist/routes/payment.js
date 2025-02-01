"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = __importDefault(require("../middleware/authentication"));
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
const verifyCart_1 = __importDefault(require("../middleware/verifyCart"));
const paystackPayment_1 = require("../controllers/paystackPayment");
route.post("/paystack/initiate", authentication_1.default, verifyCart_1.default, paystackPayment_1.chargePayment);
route.get("/paystack/callback", paystackPayment_1.verifyPaymentCallback);
route.post("/paystack/webhook", paystackPayment_1.webhookVerification);
exports.default = route;
