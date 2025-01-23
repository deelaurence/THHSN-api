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
exports.deleteShipping = exports.updateShipping = exports.getShippingById = exports.getAvailableShipping = exports.getAllShipping = exports.createShipping = void 0;
const shipping_1 = __importDefault(require("../models/shipping")); // Adjust the path based on your folder structure
const http_status_codes_1 = require("http-status-codes");
const customErrors_1 = require("../errors/customErrors");
const customResponse_1 = require("../utils/customResponse");
// Create new shipping entries in bulk or update existing ones
const createShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shippingEntries = req.body.states; // Expecting an array of objects
        if (!Array.isArray(shippingEntries) || shippingEntries.length === 0) {
            throw new customErrors_1.BadRequest('An array of shipping entries is required.');
        }
        // Validate each entry
        for (const entry of shippingEntries) {
            if (!entry.location || typeof entry.price !== 'number') {
                throw new customErrors_1.BadRequest('Each shipping entry must include a valid location and price.');
            }
        }
        // Delete all existing shipping entries
        yield shipping_1.default.deleteMany({});
        // Insert new shipping entries
        const results = yield shipping_1.default.insertMany(shippingEntries);
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json((0, customResponse_1.successResponse)(results, http_status_codes_1.StatusCodes.CREATED, 'Shipping entries created or updated successfully'));
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.createShipping = createShipping;
// Get all shipping entries
const getAllShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shippingEntries = yield shipping_1.default.find();
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json((0, customResponse_1.successResponse)(shippingEntries, http_status_codes_1.StatusCodes.OK, 'Shipping entries retrieved successfully'));
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.getAllShipping = getAllShipping;
// Get all shipping entries where the price has been populated
const getAvailableShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shippingEntries = yield shipping_1.default.find({ price: { $gt: 0 } });
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json((0, customResponse_1.successResponse)(shippingEntries, http_status_codes_1.StatusCodes.OK, 'Shipping entries retrieved successfully'));
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.getAvailableShipping = getAvailableShipping;
// Get a single shipping entry by ID
const getShippingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const shippingEntry = yield shipping_1.default.findById(id);
        if (!shippingEntry) {
            throw new customErrors_1.NotFound('Shipping entry not found.');
        }
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json((0, customResponse_1.successResponse)(shippingEntry, http_status_codes_1.StatusCodes.OK, 'Shipping entry retrieved successfully'));
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.getShippingById = getShippingById;
// Update a shipping entry by ID
const updateShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { location, price } = req.body;
        if (!location || !price) {
            throw new customErrors_1.BadRequest('Location and price are required.');
        }
        const updatedShipping = yield shipping_1.default.findByIdAndUpdate(id, { location, price }, { new: true, runValidators: true });
        if (!updatedShipping) {
            throw new customErrors_1.NotFound('Shipping entry not found.');
        }
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json((0, customResponse_1.successResponse)(updatedShipping, http_status_codes_1.StatusCodes.OK, 'Shipping entry updated successfully'));
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.updateShipping = updateShipping;
// Delete a shipping entry by ID
const deleteShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedShipping = yield shipping_1.default.findByIdAndDelete(id);
        if (!deletedShipping) {
            throw new customErrors_1.NotFound('Shipping entry not found.');
        }
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json((0, customResponse_1.successResponse)(null, http_status_codes_1.StatusCodes.OK, 'Shipping entry deleted successfully'));
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.deleteShipping = deleteShipping;
