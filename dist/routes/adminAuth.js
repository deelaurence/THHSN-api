"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuth_1 = require("../controllers/adminAuth");
const router = express_1.default.Router();
router.post('/register', adminAuth_1.register);
router.post('/login', adminAuth_1.login);
router.post('/verify-email-password-reset', adminAuth_1.verifyEmailPasswordReset);
router.get('/verified-email-password-reset/:signature', adminAuth_1.verifiedEmailPasswordReset);
router.post('/update-password', adminAuth_1.updatePassword);
exports.default = router;
