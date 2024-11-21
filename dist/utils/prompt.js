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
exports.liberalPrompt = exports.recommendResponsibilities = void 0;
require("dotenv").config();
const generative_ai_1 = require("@google/generative-ai");
const geminiKey = process.env.GEMINI_KEY;
//@ts-ignore
const genAI = new generative_ai_1.GoogleGenerativeAI(geminiKey);
// Access your API key as an environment variable (see "Set up your API key" above)
function recommendResponsibilities(profession, company, jobTitle, city, country) {
    return __awaiter(this, void 0, void 0, function* () {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
  I am a ${jobTitle} and I worked at ${company}
  in ${city}, ${country}
  as a ${jobTitle} generate twenty(20) responsibilities
  I would have carried out in past tense.
  `;
        const result = yield model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const actionsArray = text.split('\n');
        console.log(prompt);
        let actionsWithoutNumbering = actionsArray.map(action => action.replace(/^\d+\.\s/, ''));
        // remove asteriks
        actionsWithoutNumbering.forEach((action) => {
            action.replace("*", '');
        });
        //   console.log(actionsWithoutNumbering);
        return actionsWithoutNumbering;
    });
}
exports.recommendResponsibilities = recommendResponsibilities;
function liberalPrompt(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = yield model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        //   console.log(actionsWithoutNumbering);
        return text;
    });
}
exports.liberalPrompt = liberalPrompt;
