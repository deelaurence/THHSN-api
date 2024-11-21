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
exports.generate = void 0;
// const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const generative_ai_1 = require("@google/generative-ai");
//@ts-ignore
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_KEY);
// Access your API key as an environment variable (see "Set up your API key" above)
function generate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = req.body.prompt;
        const result = yield model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log(text);
        res.json({ text });
    });
}
exports.generate = generate;
