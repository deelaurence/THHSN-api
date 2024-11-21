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
exports.uploadToCloudinary = exports.optimizeImageToWebp = void 0;
// cloudinaryUtils.ts
const cloudinary_1 = require("cloudinary");
const sharp_1 = __importDefault(require("sharp"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});
// Function to convert an image buffer to WebP format using sharp
const optimizeImageToWebp = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const converted = yield (0, sharp_1.default)(buffer)
            .webp({ quality: 80 })
            .toBuffer();
        return converted;
    }
    catch (err) {
        console.log('Error converting image:', err.message);
        return null;
    }
});
exports.optimizeImageToWebp = optimizeImageToWebp;
// Function to upload the WebP image to Cloudinary
const uploadToCloudinary = (buffer, folderName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({ folder: folderName, format: 'webp' }, (error, result) => {
            if (error) {
                console.log('Cloudinary Upload Error:', error);
                return reject(error);
            }
            resolve(result);
        });
        stream.end(buffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
