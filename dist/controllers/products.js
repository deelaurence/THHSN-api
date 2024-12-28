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
exports.getProducts = exports.deleteProduct = exports.updateProductVariation = exports.updateProductImage = exports.bestsellerAndNewArrivalCoverImage = exports.updateProductBestsellerAndNewArrival = exports.updateProductNameAndDescription = exports.getProduct = exports.addProduct = void 0;
const products_1 = require("../models/products");
const http_status_codes_1 = require("http-status-codes");
const customErrors_1 = require("../errors/customErrors");
const customResponse_1 = require("../utils/customResponse");
// Create a new product
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, category, description, } = req.body;
        if (!name || !category) {
            throw new customErrors_1.BadRequest('Please supply Product Name and Category');
        }
        const productExists = yield products_1.BaseProduct.findOne({ name });
        if (productExists)
            throw new customErrors_1.BadRequest("Product name already exusting, Do you mind editing instead?");
        const newProduct = yield products_1.BaseProduct.create(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json((0, customResponse_1.successResponse)(newProduct, http_status_codes_1.StatusCodes.CREATED, 'Product created successfully'));
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.addProduct = addProduct;
// Get a product by ID
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield products_1.BaseProduct.findById(id);
        if (!product) {
            throw new customErrors_1.NotFound('Product not found');
        }
        res.status(http_status_codes_1.StatusCodes.OK).json((0, customResponse_1.successResponse)(product, http_status_codes_1.StatusCodes.OK, 'Product retrieved successfully'));
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.getProduct = getProduct;
// Get products that all fields are completed
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const referer = req.headers.referer ? req.headers.referer.replace(/\/$/, '') : '';
        const products = yield products_1.BaseProduct.aggregate([
            {
                $match: {
                    images: { $exists: true, $not: { $size: 0 } },
                    variations: { $exists: true, $not: { $size: 0 } },
                },
            },
            {
                $sort: { _id: -1 },
            },
            {
                $addFields: {
                    coverImage: {
                        $cond: {
                            if: { $ifNull: ["$coverImage", false] }, // Check if coverImage exists
                            then: { $concat: [referer, "$coverImage"] }, // Concatenate prefix
                            else: null, // Leave it as null if not present
                        },
                    },
                },
            },
        ]);
        res.status(http_status_codes_1.StatusCodes.OK).json((0, customResponse_1.successResponse)(products, http_status_codes_1.StatusCodes.OK, 'Product retrieved successfully'));
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.getProducts = getProducts;
// Update product name and description
const updateProductNameAndDescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, category, description, } = req.body;
        if (!name || !category) {
            throw new customErrors_1.BadRequest('Please supply Product Name and Category');
        }
        const updatedProduct = yield products_1.BaseProduct.findByIdAndUpdate(id, {
            name,
            category,
            description
        }, {
            new: true,
            runValidators: true,
        });
        if (!updatedProduct) {
            throw new customErrors_1.NotFound('Product not found for update');
        }
        res.status(http_status_codes_1.StatusCodes.OK).json((0, customResponse_1.successResponse)(updatedProduct, http_status_codes_1.StatusCodes.OK, 'Product updated successfully'));
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.updateProductNameAndDescription = updateProductNameAndDescription;
// Update a product variation
const updateProductVariation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedProduct = yield products_1.BaseProduct.findByIdAndUpdate(id, { variations: updateData }, {
            new: true,
        });
        if (!updatedProduct) {
            throw new customErrors_1.NotFound('Product not found for update');
        }
        res.status(http_status_codes_1.StatusCodes.OK).json((0, customResponse_1.successResponse)(updatedProduct, http_status_codes_1.StatusCodes.OK, 'Product updated successfully'));
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.updateProductVariation = updateProductVariation;
//Update product Image
const updateProductImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield products_1.BaseProduct.findById(id);
        if (!product) {
            throw new customErrors_1.NotFound('Product not found');
        }
        const uploadedImages = req.body.uploadedImages;
        if (!uploadedImages || uploadedImages.length === 0) {
            throw new customErrors_1.BadRequest("No Image Uploaded");
        }
        const imageUrls = uploadedImages.map((image) => image.secure_url);
        const updatedProduct = yield products_1.BaseProduct.findByIdAndUpdate(product._id, {
            // $push:{
            //   images:{
            //     $each:imageUrls
            //   }
            // }
            images: imageUrls
        }, {
            new: true
        });
        res.json((0, customResponse_1.successResponse)(updatedProduct, 201, "Images added to product"));
    }
    catch (error) {
        console.log('error uploading image');
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.updateProductImage = updateProductImage;
// Update product bestseller and newArrival status
const updateProductBestsellerAndNewArrival = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { bestSeller, newArrival } = req.body;
        if (bestSeller === undefined && newArrival === undefined) {
            throw new customErrors_1.BadRequest('Please supply Bestseller and New Arrival');
        }
        const updatedProduct = yield products_1.BaseProduct.findByIdAndUpdate(id, {
            bestSeller,
            newArrival
        }, {
            new: true,
            runValidators: true,
        });
        if (!updatedProduct) {
            throw new customErrors_1.NotFound('Product not found for update');
        }
        res.status(http_status_codes_1.StatusCodes.OK).json((0, customResponse_1.successResponse)(updatedProduct, http_status_codes_1.StatusCodes.OK, 'Product updated successfully'));
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.updateProductBestsellerAndNewArrival = updateProductBestsellerAndNewArrival;
// Choose bestseller and newArrival cover image
const bestsellerAndNewArrivalCoverImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { coverImage } = req.body;
        if (coverImage === undefined) {
            throw new customErrors_1.BadRequest('Please supply Image');
        }
        const updatedProduct = yield products_1.BaseProduct.findByIdAndUpdate(id, {
            coverImage
        }, {
            new: true,
            runValidators: true,
        });
        if (!updatedProduct) {
            throw new customErrors_1.NotFound('Product not found for update');
        }
        res.status(http_status_codes_1.StatusCodes.OK).json((0, customResponse_1.successResponse)(updatedProduct, http_status_codes_1.StatusCodes.OK, 'Product updated successfully'));
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.bestsellerAndNewArrivalCoverImage = bestsellerAndNewArrivalCoverImage;
// Delete a product by ID
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedProduct = yield products_1.BaseProduct.findByIdAndDelete(id);
        if (!deletedProduct) {
            throw new customErrors_1.NotFound('Product not found for deletion');
        }
        res.status(http_status_codes_1.StatusCodes.OK).json((0, customResponse_1.successResponse)({}, http_status_codes_1.StatusCodes.OK, 'Product deleted successfully'));
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.deleteProduct = deleteProduct;
