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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const adminAuth_1 = __importDefault(require("./routes/adminAuth"));
const product_1 = __importDefault(require("./routes/product"));
const node_cron_1 = __importDefault(require("node-cron"));
const publicProducts_1 = __importDefault(require("./routes/publicProducts"));
const Ai_1 = __importDefault(require("./routes/Ai"));
const swaggerDocument = require('./swagger-output.json');
const dataCollection_1 = __importDefault(require("./routes/dataCollection"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const shipping_1 = __importDefault(require("./routes/shipping"));
const userProfile_1 = __importDefault(require("./routes/userProfile"));
const googleAuth_1 = __importDefault(require("./routes/googleAuth"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const customErrors_1 = require("./errors/customErrors");
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const payment_1 = __importDefault(require("./routes/payment"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
//express session is needed for passport to work
app.use((0, express_session_1.default)({
    secret: "replace-with-secret",
    resave: false,
    saveUninitialized: false,
}));
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
app.use((0, morgan_1.default)("dev"));
// Initialize passport middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
//PASSPORT AND EXPRESS SESSION MIDDLEWARES MUST BE
//INITIALIZED BEFORE CALLING PASSPORT ROUTES
//THE ORDER MATTERS TOO EXPRESS SESSION, THEN PASSPORT
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get('/wake', (req, res) => {
    res.json({ message: "Service awake!!" });
});
app.use(body_parser_1.default.json());
app.use("/", googleAuth_1.default);
app.use('/v1/auth', auth_1.default);
app.use('/v1/admin/auth', adminAuth_1.default);
app.use('/v1/admin/manage', product_1.default);
app.use('/v1/public', publicProducts_1.default);
app.use('/v1/prompt', Ai_1.default);
app.use('/v1/resume', dataCollection_1.default);
app.use('/v1/profile', userProfile_1.default);
app.use('/v1/payment', payment_1.default);
app.use('/v1/shipping', shipping_1.default);
app.use("/v1/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(require('./docs')));
app.set('trust proxy', 1);
app.use("*", (req, res) => {
    console.log("Route not found");
    res.status(404).json(new customErrors_1.NotFound("Requested resource not found"));
});
const connectionString = process.env.MONGODB_URI || '';
mongoose_1.default.connect(connectionString);
node_cron_1.default.schedule('*/8 * * * *', () => {
    makeApiRequest();
});
const apiEndpoints = ['https://wake-up-skyskill.onrender.com'];
// Function to make the API request using Axios
function makeApiRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            apiEndpoints.forEach((endpoint) => __awaiter(this, void 0, void 0, function* () {
                const response = yield axios_1.default.get(endpoint);
                console.log(response.data);
            }));
        }
        catch (error) {
            console.error('Error during API request:', error.message);
        }
    });
}
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}..`);
});
exports.default = app;
