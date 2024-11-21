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
// uploadMiddleware.ts
const multer_1 = __importDefault(require("multer"));
const cloudinaryConfig_1 = require("../utils/cloudinaryConfig");
// Multer configuration to use memory storage
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });
// Middleware to handle multiple image uploads and conversion
const uploadAndConvertToWebp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).send('No files uploaded');
    }
    try {
        const uploadedImages = [];
        // Iterate through each file and convert/upload them
        for (const file of req.files) {
            const webpBuffer = yield (0, cloudinaryConfig_1.optimizeImageToWebp)(file.buffer);
            if (!webpBuffer) {
                return res.status(500).send('Failed to convert one or more images');
            }
            // Upload the converted image to Cloudinary
            const result = yield (0, cloudinaryConfig_1.uploadToCloudinary)(webpBuffer, 'your_folder_name');
            uploadedImages.push(result); // Collect the uploaded image data
        }
        // Store all uploaded images in `req.body` for later use in the controller
        req.body.uploadedImages = uploadedImages;
        next(); // Proceed to the next middleware/controller
    }
    catch (error) {
        console.log('Error processing files:', error);
        res.status(500).send('Failed to process files');
    }
});
exports.uploadAndConvertToWebp = uploadAndConvertToWebp;
