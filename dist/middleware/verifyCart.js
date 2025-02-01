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
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const customErrors_1 = require("../errors/customErrors");
const products_1 = require("../models/products");
const verifyCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('verifyCart start');
        const cart = req.body.cart;
        const allProducts = yield products_1.BaseProduct.find();
        // Convert products into a Map for quick lookup
        const productMap = new Map();
        console.log(req.body.cartTotal);
        for (const product of allProducts) {
            productMap.set(product.name, product.variations.flatMap(v => v.variations));
        }
        let totalClientCartPrice = 0;
        for (const cartItem of cart) {
            if (!productMap.has(cartItem.name))
                continue; // Skip if product does not exist
            totalClientCartPrice = totalClientCartPrice + (cartItem.price * cartItem.quantity);
            const variants = productMap.get(cartItem.name);
            //@ts-ignore
            const matchingVariant = variants.find(v => v.variation === cartItem.variant.name);
            if (matchingVariant) {
                if (matchingVariant.price !== cartItem.price) {
                    throw new customErrors_1.BadRequest('Price mismatch');
                }
                // next()
            }
        }
        console.log(totalClientCartPrice, req.body.cartTotal);
        if (totalClientCartPrice !== req.body.cartTotal) {
            throw new customErrors_1.BadRequest('Price and quantity mismatch');
        }
        console.log('verifyCart end, next');
        next();
    }
    catch (error) {
        // If the error has a custom statusCode, use it; otherwise, default to 401
        const statusCode = error.statusCode || http_status_codes_1.StatusCodes.BAD_REQUEST;
        const message = error.message || 'Cart discrepancy';
        console.log(error);
        return res.status(statusCode).json(new customErrors_1.BadRequest(message));
    }
});
exports.default = verifyCart;
