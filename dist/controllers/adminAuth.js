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
exports.getAdmin = exports.updateAdmin = exports.updatePassword = exports.verifyEmailPasswordReset = exports.verifiedEmailPasswordReset = exports.deleteAdmin = exports.login = exports.register = void 0;
require("dotenv").config();
const admin_1 = require("../models/admin");
const brevomail_1 = require("../utils/brevomail");
const nameFormat_1 = require("../utils/nameFormat");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const customResponse_1 = require("../utils/customResponse");
const customErrors_1 = require("../errors/customErrors");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.name || !req.body.email) {
            throw new customErrors_1.BadRequest("Supply Name, Password and Email");
        }
        if (!(0, nameFormat_1.isValidNameInput)(req.body.name)) {
            throw new customErrors_1.BadRequest("Enter both Lastname and Firstname, No compound names");
        }
        const existingAdmin = yield admin_1.BaseAdmin.findOne({ email: req.body.email });
        if (existingAdmin) {
            throw new customErrors_1.Conflict("You are already registered, Log in");
        }
        const newAdmin = yield admin_1.BaseAdmin.create(req.body);
        const token = newAdmin.generateJWT(process.env.JWT_SECRET);
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json((0, customResponse_1.successResponse)({
            name: newAdmin.name,
            email: newAdmin.email,
        }, http_status_codes_1.StatusCodes.CREATED, "Admin created successfully"));
    }
    catch (error) {
        console.log(error.message);
        if (error.code === 11000 || error.statusCode === 409) {
            res
                .status(http_status_codes_1.StatusCodes.CONFLICT)
                .json(new customErrors_1.Conflict(error.message));
            return;
        }
        if (error.statusCode == 400) {
            res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json(new customErrors_1.BadRequest(error.message));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.register = register;
//logic sends email before password reset
const verifyEmailPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield admin_1.BaseAdmin.findOne({ email: req.body.email });
        if (!admin) {
            throw new customErrors_1.NotFound("Admin not found, Check email again or Register");
        }
        const token = admin.generateJWT(process.env.JWT_SECRET);
        const link = `${process.env.SERVER_URL}/auth/verified-email-password-reset/${token}`;
        const mailStatus = yield (0, brevomail_1.sendPasswordResetMail)(req.body.email, admin.name, link);
        console.log(mailStatus);
        if (mailStatus != 201) {
            throw new customErrors_1.InternalServerError("Something went wrong while trying to send verification email, try again later");
        }
        return res.json((0, customResponse_1.successResponse)({}, http_status_codes_1.StatusCodes.OK, `An Email has been sent to ${req.body.email} follow the instructions accordingly`));
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json(error);
    }
});
exports.verifyEmailPasswordReset = verifyEmailPasswordReset;
//Logic called when email link is clicked
const verifiedEmailPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.signature);
        const token = req.params.signature;
        const secret = process.env.JWT_SECRET;
        const payload = jsonwebtoken_1.default.verify(token, secret);
        const admin = yield admin_1.BaseAdmin.findOneAndUpdate({ _id: payload.id }, { canResetPassword: true });
        //Redirect to a client page that can display the email
        //and prompt the admin for thier new password
        const adminEmail = admin === null || admin === void 0 ? void 0 : admin.email;
        res
            .status(http_status_codes_1.StatusCodes.PERMANENT_REDIRECT)
            .redirect(`${process.env.CLIENT_URL}/auth/reset-password/?email=${encodeURIComponent(adminEmail)}`);
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
});
exports.verifiedEmailPasswordReset = verifiedEmailPasswordReset;
//Update password after email has
//been verified for password reset
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.password || !req.body.email) {
            throw new customErrors_1.BadRequest("Supply admin email and new password");
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, salt);
        const admin = yield admin_1.BaseAdmin.findOne({ email: req.body.email });
        if (!admin) {
            throw new customErrors_1.BadRequest("Admin with the supplied email not found");
        }
        if (!(admin === null || admin === void 0 ? void 0 : admin.canResetPassword)) {
            throw new customErrors_1.BadRequest("You need to verify email before resetting password!");
        }
        const edited = yield admin_1.BaseAdmin.findOneAndUpdate({
            email: req.body.email,
        }, { password: hashedPassword, canResetPassword: false }, { new: true, runValidators: true });
        res.json((0, customResponse_1.successResponse)({}, http_status_codes_1.StatusCodes.OK, "Password Reset Successful"));
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(error);
    }
});
exports.updatePassword = updatePassword;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new customErrors_1.BadRequest("email and password cannot be empty");
        }
        const admin = yield admin_1.BaseAdmin.findOne({ email: email });
        if (!admin) {
            throw new customErrors_1.NotFound("Email not registered, Sign up");
        }
        const isMatch = yield admin.comparePassword(password);
        if (!isMatch) {
            throw new customErrors_1.Unauthenticated("Invalid credentials");
        }
        const token = admin.generateJWT(process.env.JWT_SECRET);
        return res.status(http_status_codes_1.StatusCodes.OK).
            json((0, customResponse_1.successResponse)({
            token: token,
            email: admin.email,
            name: admin.name
        }, http_status_codes_1.StatusCodes.OK, 'Welcome back'));
    }
    catch (error) {
        const { message, statusCode } = error;
        if (statusCode) {
            res.status(statusCode).json(error);
            console.log(statusCode, message);
            return;
        }
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(error);
        console.log(message);
    }
});
exports.login = login;
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.params.email;
        const admin = yield admin_1.BaseAdmin.findOneAndDelete({ email });
        if (!admin) {
            throw new customErrors_1.NotFound(`${email} does not exist`);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: `${email} removed` });
    }
    catch (error) {
        console.error(error);
        res.status(error.statusCode).json({ error: error.message });
    }
});
exports.deleteAdmin = deleteAdmin;
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { phoneNumber, onWhatsapp, gender, levelOfExpertise, employmentStatus, state, country, referralStatus, } = req.body;
        const admin = yield admin_1.BaseAdmin.findById((_a = req.decoded) === null || _a === void 0 ? void 0 : _a.id);
        let fieldToUpdate = onWhatsapp ? { onWhatsapp } : {
            phoneNumber,
            gender,
            levelOfExpertise,
            employmentStatus,
            state,
            country,
            referralStatus
        };
        const adminupdate = yield admin_1.BaseAdmin.findOneAndUpdate({ _id: (_b = req.decoded) === null || _b === void 0 ? void 0 : _b.id }, fieldToUpdate, { new: true });
        res
            .status(200);
    }
    catch (error) {
        if (error.status)
            return res
                .status(error.status);
    }
});
exports.updateAdmin = updateAdmin;
const getAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const admin = yield admin_1.BaseAdmin.findOne({ email });
    }
    catch (error) {
        if (error.status)
            return res
                .status(error.status);
    }
});
exports.getAdmin = getAdmin;
