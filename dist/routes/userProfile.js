"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userProfile_1 = require("../controllers/userProfile");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const router = express_1.default.Router();
router.use(authentication_1.default);
router.get('/fetch', userProfile_1.getUserProfile);
exports.default = router;
