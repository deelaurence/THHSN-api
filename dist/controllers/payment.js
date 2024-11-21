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
exports.verifyPaymentCallback = exports.webhookVerification = exports.chargePayment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const customResponse_1 = require("../utils/customResponse");
const uuid_1 = require("uuid");
const store_1 = __importDefault(require("../store/store"));
const axios_1 = __importDefault(require("axios"));
const paystack_1 = __importDefault(require("paystack"));
const user_1 = require("../models/user");
const payment_1 = __importDefault(require("../models/payment"));
const customErrors_1 = require("../errors/customErrors");
const hotError_1 = require("../errors/hotError");
const crypto_1 = __importDefault(require("crypto"));
const secretKey = process.env.paystack_key;
const clientUrl = process.env.CLIENT_URL + "/#";
const _paystack = (0, paystack_1.default)(secretKey);
let payingUserCache;
const store = new store_1.default();
const dateFormat = store.formatDate;
const chargePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Create a new transaction
        const userId = (_a = req.decoded) === null || _a === void 0 ? void 0 : _a.id;
        const user = yield user_1.BaseUser.findOne({ _id: userId });
        let { amount, description } = req.body;
        amount = amount * 100;
        if (!user) {
            throw new customErrors_1.NotFound("User not found");
        }
        if (!description || !amount) {
            throw new customErrors_1.BadRequest("Supply description and amount");
        }
        const transaction = yield _paystack.transaction.initialize({
            amount: amount, // Amount in kobo (100000 kobo = ₦1,000)
            email: user.email,
            metadata: {
                description,
                name: user.name,
            },
        });
        console.log(transaction);
        // Redirect the customer to the payment page
        res.json((0, customResponse_1.successResponse)({ redirect: transaction.data.authorization_url }, 200, "Succesfully Initialized payment"));
    }
    catch (error) {
        (0, hotError_1.hotError)(error, res);
    }
});
exports.chargePayment = chargePayment;
//webhook verification
function verifyWebhookSignature(headerSignature, requestPayload) {
    const computedSignature = crypto_1.default
        //@ts-ignore
        .createHmac("sha512", secretKey)
        .update(requestPayload)
        .digest("hex");
    return headerSignature === computedSignature;
}
const webhookVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify the signature
    const headerSignature = req.headers["x-paystack-signature"];
    const isSignatureValid = verifyWebhookSignature(headerSignature, JSON.stringify(req.body));
    if (!isSignatureValid) {
        res.status(400).send("Invalid signature");
        return;
    }
    // Process the webhook event
    const event = req.body;
    const eventType = event.event;
    const eventData = event.data;
    const payloadEmail = eventData.customer.email;
    const payloadDescription = eventData.metadata.description;
    const payloadReference = eventData.reference;
    const payloadAmount = eventData.amount;
    const payloadName = eventData.metadata.name;
    const payloadAuth = eventData.authorization.authorization_code;
    // Handle the event based on the event type
    if (eventType === "charge.success") {
        const payingUser = yield user_1.BaseUser.findOne({ email: payloadEmail });
        // save eventData to db
        yield payment_1.default.create({
            owner: payloadEmail,
            id: (0, uuid_1.v4)(),
            name: payloadName,
            date: dateFormat(),
            status: "Success",
            paystackAuthorization: payloadAuth,
            amount: payloadAmount / 100,
            description: payloadDescription,
            reference: payloadReference,
        });
    }
    else if (eventType === "charge.failed") {
        yield payment_1.default.create({
            owner: payloadEmail,
            id: (0, uuid_1.v4)(),
            name: payloadName,
            date: dateFormat(),
            status: "Failed",
            amount: payloadAmount / 100,
            description: payloadDescription,
            reference: payloadReference,
        });
        // Handle failed payment event
        console.log("Payment failed.");
        // Take appropriate actions like notifying the user, logging the failure, etc.
    }
    else if (eventType === "charge.refunded") {
        // Handle refunded payment event
        console.log("Payment refunded.");
        yield payment_1.default.create({
            owner: payloadEmail,
            id: (0, uuid_1.v4)(),
            name: payloadName,
            date: dateFormat(),
            status: "Refunded",
            amount: payloadAmount / 100,
            description: payloadDescription,
            reference: payloadReference,
        });
    }
    else {
        // Handle other events as needed
        console.log(eventType);
    }
    // Respond with a success status
    res.sendStatus(200);
});
exports.webhookVerification = webhookVerification;
// Handle the callback URL
const verifyPaymentCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reference = req.query.reference;
        // Verify the transaction
        const response = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.paystack_key}`,
            },
        });
        // Process the transaction response
        if (response.data.data.status === "success") {
            // res.json({message:"payment sucessful"})
            console.log("Payment successful");
            const amount = response.data.data.amount / 100;
            const description = response.data.data.metadata.description;
            const name = response.data.data.metadata.name;
            const reference = response.data.data.reference;
            res.redirect(`${clientUrl}/receipt?amount=${amount}&description=${description}&reference=${reference}&name=${name}`);
        }
        else {
            // Payment is not successful
            // Do something here (e.g., display an error message, handle failed payment)
            console.log("Payment not successful");
        }
    }
    catch (error) {
        console.error("Verification error:", error);
        res.status(500).send("Verification error");
    }
});
exports.verifyPaymentCallback = verifyPaymentCallback;
// const getSinglePayment = async (req, res) => {
//   try {
//     const PaymentId = req.params.id;
//     let query = {
//       _id: PaymentId,
//     };
//     //admin requests have req.decoded
//     if (req.decoded) {
//       query = { id: PaymentId };
//     }
//     const singlePayment = await Payment.findOne(query);
//     if (!singlePayment) {
//       throw new NotFound(`no Message with id ${PaymentId} `);
//     }
//     res.status(200).json(singlePayment);
//   } catch (error) {
//     console.log(error.message);
//     res.status(400).json({ message: error.message });
//   }
// };
// const getPayments = async (req, res) => {
//   try {
//     let query = {};
//     console.log(req.decoded);
//     //Requests coming from admin passses thru middleware
//     if (req.decoded) {
//       query = { owner: req.decoded.id };
//     }
//     const allPayments = await Payment.find().sort({ _id: -1 });
//     // .skip(pageOptions.page * pageOptions.limit)
//     // .limit(pageOptions.limit);
//     if (allPayments.length < 1) {
//       throw new NotFound("No Payment found");
//     }
//     res.status(200).json(allPayments);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//     console.log(error.message);
//   }
// };
