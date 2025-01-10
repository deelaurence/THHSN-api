"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseExchangeRate = void 0;
const mongoose_1 = require("mongoose");
const ExchangeSchema = new mongoose_1.Schema({
    rate: {
        type: Number,
        required: [true, "Supply Rate"]
    },
    currencyPair: {
        type: String,
        required: [true, "Supply Currency Pair"]
    },
});
const BaseExchangeRate = (0, mongoose_1.model)('ExchangeRate', ExchangeSchema);
exports.BaseExchangeRate = BaseExchangeRate;
