"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// productRoutes.ts
const express_1 = __importDefault(require("express"));
const products_1 = require("../controllers/products"); // Adjust the path as needed
const router = express_1.default.Router();
router.get('/products', products_1.getProducts);
router.get('/exchange-rate/:currencyPair', products_1.getExchangeRate);
exports.default = router;
