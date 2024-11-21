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
exports.uploadAndConvertToWebp = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinaryConfig_1 = require("../utils/cloudinaryConfig");
const customErrors_1 = require("../errors/customErrors");
const store_1 = __importDefault(require("../store/store"));
const { maxImageToBeUploaded } = new store_1.default();
// Multer configuration to use memory storage
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });
// Middleware to handle multiple image uploads and conversion
const uploadAndConvertToWebp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw new customErrors_1.BadRequest('No files uploaded');
        }
        if (req.files.length > maxImageToBeUploaded) {
            throw new customErrors_1.BadRequest(`A maximum of ${maxImageToBeUploaded} images can be uploaded`);
        }
        const uploadedImages = [];
        // Iterate through each file and convert/upload them
        for (const file of req.files) {
            const webpBuffer = yield (0, cloudinaryConfig_1.optimizeImageToWebp)(file.buffer);
            if (!webpBuffer) {
                return res.status(400).json(new customErrors_1.BadRequest("Converting pictures to WEBP format failed"));
            }
            // Upload the converted image to Cloudinary
            const result = yield (0, cloudinaryConfig_1.uploadToCloudinary)(webpBuffer, 'THHSN');
            uploadedImages.push(result); // Collect the uploaded image data
        }
        // Store all uploaded images in `req.body` for later use in the controller
        req.body.uploadedImages = uploadedImages;
        next(); // Proceed to the next middleware/controller
    }
    catch (error) {
        console.log('Error processing files:', error);
        res.status(400).json(new customErrors_1.BadRequest(error.message || "Error processing files"));
    }
});
exports.uploadAndConvertToWebp = uploadAndConvertToWebp;
