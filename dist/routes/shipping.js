"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuthentication_1 = __importDefault(require("../middleware/adminAuthentication"));
const shipping_1 = require("../controllers/shipping"); // Adjust the path as needed
const router = express_1.default.Router();
// Create a new shipping entry
router.post('/create', adminAuthentication_1.default, shipping_1.createShipping);
router.get('/available', shipping_1.getAvailableShipping);
// Get all shipping entries
router.get('/', adminAuthentication_1.default, shipping_1.getAllShipping);
// Get a specific shipping entry by ID
router.get('/:id', adminAuthentication_1.default, shipping_1.getShippingById);
// Update a specific shipping entry by ID
router.put('/:id', adminAuthentication_1.default, shipping_1.updateShipping);
// Delete a specific shipping entry by ID
router.delete('/:id', adminAuthentication_1.default, shipping_1.deleteShipping);
exports.default = router;
