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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Responsibility = exports.RawCareerSummary = exports.RawResponsibility = exports.Resume = void 0;
const mongoose_1 = __importStar(require("mongoose"));
//SCHEMA DEFINITIONS
const responsibilitySchema = new mongoose_1.Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    responsibilities: [{
            type: String,
            required: true,
        }],
});
const RawResponsibilitySchema = new mongoose_1.Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    responsibilities: [{
            type: String,
            required: true,
        }],
});
const RawCareerSummarySchema = new mongoose_1.Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    careerSummary: [{
            type: String,
            required: true,
        }],
});
const resumeSchema = new mongoose_1.Schema({
    completed: {
        type: Boolean,
        default: false,
    },
    profession: {
        type: String,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    city: {
        type: String,
    },
    phoneNumber: {
        type: String
    },
    country: {
        type: String,
    },
    publicEmail: {
        type: String,
        lowercase: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ],
    },
    jobExperiences: [
        {
            jobTitle: {
                type: String,
                required: true,
            },
            company: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            startDate: {
                type: String,
                required: true,
            },
            endDate: {
                type: String
            },
            currentlyWorking: {
                type: Boolean,
            },
            responsibilities: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Responsibility',
            },
            rawResponsibilities: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'RawResponsibility',
            },
        },
    ],
    education: [
        {
            schoolName: {
                type: String,
                required: true,
            },
            schoolLocation: {
                type: String,
            },
            degreeType: {
                type: String,
            },
            studyField: {
                type: String,
            },
            startDate: {
                type: String,
            },
            graduationDate: {
                type: String
            },
            stillEnrolled: {
                type: Boolean,
            }
        },
    ],
    tools: {
        type: [String],
    },
    skills: {
        type: [String],
    },
    rawTools: {
        type: [String],
    },
    rawSkills: {
        type: [String],
    },
    careerSummary: {
        type: String,
    },
    rawCareerSummary: {
        type: [String],
    },
}, {
    timestamps: true
});
//EXPORTS
const Resume = (0, mongoose_1.model)('Resume', resumeSchema);
exports.Resume = Resume;
const RawResponsibility = (0, mongoose_1.model)('RawResponsibility', RawResponsibilitySchema);
exports.RawResponsibility = RawResponsibility;
const RawCareerSummary = (0, mongoose_1.model)('RawCareerSummary', RawCareerSummarySchema);
exports.RawCareerSummary = RawCareerSummary;
const Responsibility = (0, mongoose_1.model)('Responsibility', responsibilitySchema);
exports.Responsibility = Responsibility;
