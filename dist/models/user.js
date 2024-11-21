"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.BaseUser = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String, //for email sending purposes only
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
    // _id: mongoose.Types.ObjectId,
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: [true, "email already registered"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ],
    },
    publicEmail: {
        type: String,
        lowercase: true,
        trim: true,
        unique: [true, "email already registered"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ],
    },
    password: {
        type: String,
        minlength: 6,
    },
    googleId: {
        type: String,
    },
    canResetPassword: {
        type: Boolean,
        default: false,
    },
    resumes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Resume'
        }],
    displayName: {
        type: String,
    },
    userId: {
        type: String,
    },
    provider: {
        type: String,
    },
    phoneNumber: {
        type: String,
        default: null,
    },
    gender: {
        type: String,
        default: null,
    },
    country: {
        type: String,
        default: null,
    },
    city: {
        type: String,
        default: null,
    }
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            const salt = yield bcryptjs_1.default.genSalt(10);
            if (this.password && !this.password.startsWith('$2a')) {
                console.log('hashing password...');
                this.password = yield bcryptjs_1.default.hash(this.password, salt);
            }
        }
        next();
    });
});
userSchema.methods.generateJWT = function (signature) {
    return jsonwebtoken_1.default.sign({ id: this._id, name: this.name }, signature, { expiresIn: '24h' });
};
userSchema.methods.comparePassword = function (passwordInput) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(passwordInput, this.password);
    });
};
const BaseUser = (0, mongoose_1.model)('User', userSchema);
exports.BaseUser = BaseUser;
// export default model<IUser>('User', userSchema);
