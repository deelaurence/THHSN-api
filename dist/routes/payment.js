"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = __importDefault(require("../middleware/authentication"));
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
const payment_1 = require("../controllers/payment");
route.post("/paystack/initiate", authentication_1.default, payment_1.chargePayment);
route.get("/paystack/callback", payment_1.verifyPaymentCallback);
route.post("/paystack/webhook", payment_1.webhookVerification);
exports.default = route;
