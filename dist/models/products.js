"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProduct = void 0;
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Supply Product Name"]
    },
    category: {
        type: String,
        required: [true, "Supply Product Category"]
    },
    description: {
        type: String,
    },
    quantity: {
        type: Number,
        required: [true, "Supply Product qunatity in stock"]
    },
    price: {
        type: Number,
        required: [true, "Supply Product base price"]
    },
    images: {
        type: [],
    }
});
const BaseProduct = (0, mongoose_1.model)('Product', ProductSchema);
exports.BaseProduct = BaseProduct;
