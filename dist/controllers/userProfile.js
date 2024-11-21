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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = void 0;
const http_status_codes_1 = require("http-status-codes");
const customResponse_1 = require("../utils/customResponse");
const customErrors_1 = require("../errors/customErrors");
const user_1 = require("../models/user");
//Create new resume and return the ID
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req === null || req === void 0 ? void 0 : req.decoded) === null || _a === void 0 ? void 0 : _a.id;
        const userProfile = yield user_1.BaseUser.findById(userId)
            .populate({
            path: 'resumes', // Populate resumes
            populate: [
                { path: 'jobExperiences.responsibilities' }, // Populate responsibilities
                { path: 'jobExperiences.rawResponsibilities' } // Populate rawResponsibilities
            ]
        });
        //Push resume into resumes field in user object
        res.status(201).json((0, customResponse_1.successResponse)(userProfile, http_status_codes_1.StatusCodes.CREATED, "This is the updated user profile"));
    }
    catch (error) {
        // Handle errors 
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.getUserProfile = getUserProfile;
