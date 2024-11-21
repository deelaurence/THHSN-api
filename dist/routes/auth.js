"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = require("../controllers/userAuth");
const router = express_1.default.Router();
router.post('/register', userAuth_1.register);
router.post('/login', userAuth_1.login);
router.delete('/user/:email', userAuth_1.deleteUser);
router.get('/verify-email/:signature', userAuth_1.verifyEmail);
router.post('/verify-email-password-reset', userAuth_1.verifyEmailPasswordReset);
router.get('/verified-email-password-reset/:signature', userAuth_1.verifiedEmailPasswordReset);
router.post('/update-password', userAuth_1.updatePassword);
router.put('/update-user', userAuth_1.updateUser);
router.get('/get-user/:email', userAuth_1.getUser);
exports.default = router;
