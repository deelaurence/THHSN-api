"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// productRoutes.ts
const express_1 = __importDefault(require("express"));
const products_1 = require("../controllers/products"); // Adjust the path as needed
const adminAuthentication_1 = __importDefault(require("../middleware/adminAuthentication"));
const uploadPictures_1 = require("../middleware/uploadPictures");
const router = express_1.default.Router();
// Route to add a new product
router.post('/product/add', adminAuthentication_1.default, products_1.addProduct);
// Route to edit a product by ID
router.put('/product/:id', adminAuthentication_1.default, products_1.updateProduct);
// Route to edit a product image by ID (with max 10 images)
router.put('/product/image/:id', uploadPictures_1.upload.array('images', 10), uploadPictures_1.uploadAndConvertToWebp, products_1.updateProductImage);
// Route to delete a product by ID
router.delete('/products/:id', adminAuthentication_1.default, products_1.deleteProduct);
// Route to get a single product by ID
router.get('/products/:id', products_1.getProduct);
exports.default = router;
