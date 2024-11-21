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
exports.getUser = exports.updateUser = exports.updatePassword = exports.verifyEmailPasswordReset = exports.verifiedEmailPasswordReset = exports.verifyEmail = exports.deleteUser = exports.login = exports.register = void 0;
require("dotenv").config();
const user_1 = require("../models/user");
const brevomail_1 = require("../utils/brevomail");
const nameFormat_1 = require("../utils/nameFormat");
const http_status_codes_1 = require("http-status-codes");
// import generator from "generate-serial-number";
// const serialNumber = generator.generate(1);
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import helpers from "../../helpers";
const customResponse_1 = require("../utils/customResponse");
const customErrors_1 = require("../errors/customErrors");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // #swagger.tags = ['Onboarding']
        if (!req.body.name || !req.body.email) {
            throw new customErrors_1.BadRequest("Supply Name, Password and Email");
        }
        if (!(0, nameFormat_1.isValidNameInput)(req.body.name)) {
            throw new customErrors_1.BadRequest("Enter both Lastname and Firstname, No compound names");
        }
        const existingUser = yield user_1.BaseUser.findOne({ email: req.body.email });
        if (existingUser) {
            if (!existingUser.verified) {
                yield user_1.BaseUser.findOneAndDelete({ email: req.body.email });
                throw new customErrors_1.Conflict(`Didn't get email the first time? make sure '${req.body.email}' is a valid email.`);
            }
            throw new customErrors_1.Conflict("You are already registered, Log in");
        }
        const newUser = yield user_1.BaseUser.create(req.body);
        const token = newUser.generateJWT(process.env.JWT_SECRET);
        //send Email
        if (!req.body.verified) {
            const link = `${process.env.SERVER_URL}/auth/verify-email/${token}`;
            const mailStatus = yield (0, brevomail_1.sendBrevoMail)(req.body.email, req.body.name, link);
            //If mail sending failed delete user from database
            if (mailStatus != 201) {
                yield user_1.BaseUser.findOneAndDelete({ email: req.body.email });
                throw new customErrors_1.InternalServerError("Something went wrong while trying to send verification email, try again later");
            }
        }
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json((0, customResponse_1.successResponse)({
            name: newUser.name,
            email: newUser.email,
            phonenumber: newUser.phoneNumber,
            gender: newUser.gender,
            country: newUser.country,
        }, http_status_codes_1.StatusCodes.CREATED, "To continue your registration, click the link sent to your email"));
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
//After registration an email is sent.
//clicking on the link runs this logic
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.signature;
        const secret = process.env.JWT_SECRET;
        const payload = jsonwebtoken_1.default.verify(token, secret);
        const user = yield user_1.BaseUser.findOneAndUpdate({ _id: payload.id }, { verified: true });
        // console.log(user?._id)
        const clientUrl = `${process.env.CLIENT_URL}/auth/log-in`;
        res.status(http_status_codes_1.StatusCodes.PERMANENT_REDIRECT).redirect(clientUrl);
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
});
exports.verifyEmail = verifyEmail;
//logic sends email before password reset
const verifyEmailPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.BaseUser.findOne({ email: req.body.email });
        if (!user) {
            throw new customErrors_1.NotFound("User not found, Check email again or Register");
        }
        if (user) {
            if (user && user.provider) {
                res
                    .status(http_status_codes_1.StatusCodes.CONFLICT)
                    .json({ message: "This account was registered with Google Sign-In" });
                return;
            }
        }
        const token = user.generateJWT(process.env.JWT_SECRET);
        const link = `${process.env.SERVER_URL}/auth/verified-email-password-reset/${token}`;
        const mailStatus = yield (0, brevomail_1.sendPasswordResetMail)(req.body.email, user.name, link);
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
        const user = yield user_1.BaseUser.findOneAndUpdate({ _id: payload.id }, { canResetPassword: true });
        //Redirect to a client page that can display the email
        //and prompt the user for thier new password
        const userEmail = user === null || user === void 0 ? void 0 : user.email;
        res
            .status(http_status_codes_1.StatusCodes.PERMANENT_REDIRECT)
            .redirect(`${process.env.CLIENT_URL}/auth/reset-password/?email=${encodeURIComponent(userEmail)}`);
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
            throw new customErrors_1.BadRequest("Supply user email and new password");
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, salt);
        const user = yield user_1.BaseUser.findOne({ email: req.body.email });
        if (!user) {
            throw new customErrors_1.BadRequest("User with the supplied email not found");
        }
        if (!(user === null || user === void 0 ? void 0 : user.canResetPassword)) {
            throw new customErrors_1.BadRequest("You need to verify email before resetting password!");
        }
        const edited = yield user_1.BaseUser.findOneAndUpdate({
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
        const user = yield user_1.BaseUser.findOne({ email: email })
            .populate({ path: 'resumes' });
        if (!user) {
            throw new customErrors_1.NotFound("Email not registered, Sign up");
        }
        //if user registerd via google
        if (user.provider == "google") {
            throw new customErrors_1.BadRequest("You registered with google sign in");
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            throw new customErrors_1.Unauthenticated("Invalid credentials");
        }
        if (!user.verified) {
            throw new customErrors_1.Unauthenticated("Verify your email");
        }
        const token = user.generateJWT(process.env.JWT_SECRET);
        return res.status(http_status_codes_1.StatusCodes.OK).
            json((0, customResponse_1.successResponse)({
            token: token,
            email: user.email,
            name: user.name,
            phonenumber: user.phoneNumber,
            gender: user.gender,
            country: user.country,
            resumes: user.resumes
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
// const logout = (req, res) => {
//   res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
//   res.json({ message: "logged out" });
// };
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.params.email;
        const user = yield user_1.BaseUser.findOneAndDelete({ email });
        if (!user) {
            throw new customErrors_1.NotFound(`${email} does not exist`);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: `${email} removed` });
    }
    catch (error) {
        console.error(error);
        res.status(error.statusCode).json({ error: error.message });
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { phoneNumber, onWhatsapp, gender, levelOfExpertise, employmentStatus, state, country, referralStatus, } = req.body;
        const user = yield user_1.BaseUser.findById((_a = req.decoded) === null || _a === void 0 ? void 0 : _a.id);
        let fieldToUpdate = onWhatsapp ? { onWhatsapp } : {
            phoneNumber,
            gender,
            levelOfExpertise,
            employmentStatus,
            state,
            country,
            referralStatus
        };
        const userupdate = yield user_1.BaseUser.findOneAndUpdate({ _id: (_b = req.decoded) === null || _b === void 0 ? void 0 : _b.id }, fieldToUpdate, { new: true });
        res
            .status(200);
    }
    catch (error) {
        if (error.status)
            return res
                .status(error.status);
    }
});
exports.updateUser = updateUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const user = yield user_1.BaseUser.findOne({ email });
    }
    catch (error) {
        if (error.status)
            return res
                .status(error.status);
    }
});
exports.getUser = getUser;
