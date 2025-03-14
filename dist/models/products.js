"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProduct = void 0;
const mongoose_1 = require("mongoose");
[
    {
        "name": "length",
        "variations": [
            {
                "variation": "timer",
                "price": 349,
                "quantity": 67
            },
            {
                "variation": "45 inches",
                "price": 500,
                "quantity": 4
            }
        ]
    }
];
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Supply Product Name"]
    },
    softDeleted: {
        type: Boolean,
        default: false
    },
    outOfStock: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: [true, "Supply Product Category"]
    },
    description: {
        type: String,
    },
    bestSeller: {
        type: Boolean,
        default: false,
    },
    newArrival: {
        type: Boolean,
        default: false,
    },
    coverImage: {
        type: String,
    },
    images: {
        type: [],
    },
    variations: {
        type: []
    }
});
const BaseProduct = (0, mongoose_1.model)('Product', ProductSchema);
exports.BaseProduct = BaseProduct;
