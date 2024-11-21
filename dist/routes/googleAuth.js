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
const route = express_1.default.Router();
const customErrors_1 = require("../errors/customErrors");
const customResponse_1 = require("../utils/customResponse");
const passport_1 = __importDefault(require("passport"));
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const user_1 = require("../models/user");
const http_1 = require("http");
//The google sign in logic is as atraightforward as it can be
//✅situation one1️⃣: A new user Frank signs up with google,
//his data is stored in the database, a token is generated for him
//✅situation two2️⃣: Frank comes back tomorrow and tries to login with google, 
//the logic checks if he already has an account, then generates a token for him
//✅situation three3️⃣: Frank tries to signup with normal signup using password, 
//the registration logic sees a field called provider in thier database data and
//sends a response "You already registered with google sign in"   
//✅situation three34️⃣: Frank tries to login with normal login using password, 
//the registration logic sees a field called provider in thier database data and
//sends a response "You already registered with google sign in"   
//This logic checks if the new user already exists or not
//then it proceeds to create a value on req.isAuthenticated()
//This is a passport property to check if google has authenticated the user
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "/auth/google/redirected",
    passReqToCallback: true,
    scope: ["profile", "email"],
}, 
//Logic for new users
function verify(req, accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.authError) {
                console.error(req.authError);
            }
            // Check if the user already exists in the database
            const user = yield user_1.BaseUser.findOne({ email: profile.emails[0].value });
            // console.log(profile)
            console.log("finding user");
            if (!user) {
                console.log("User has not registered before");
            }
            //localUser is used to represent user stored on our database
            let localUser;
            //if user already exists set the value to localUser
            if (user) {
                console.log("User has registered before");
                localUser = user;
            }
            //if user does not exist proceed to create
            if (!user) {
                console.log("Creating user " + profile.emails[0].value);
                // Create a new user
                localUser = yield user_1.BaseUser.create({
                    name: profile.displayName,
                    verified: true,
                    email: profile.emails[0].value,
                    referralCode: crypto.randomUUID().substring(0, 6),
                    // user_id: localUser._id,
                    provider: profile.provider,
                    subject: profile.id,
                });
                return done(null, localUser);
            }
            // User already exists, fetch the user details
            const existingUser = yield user_1.BaseUser.findOne({ _id: localUser === null || localUser === void 0 ? void 0 : localUser._id });
            if (!existingUser) {
                return done(null, false);
            }
            return done(null, existingUser);
        }
        catch (error) {
            console.log(error);
            return done(error);
        }
    });
}));
//Configure passport serialization and deserialization
//serialize stores unique user info on the sessions (user._id)
passport_1.default.serializeUser(function (user, done) {
    done(null, user._id);
});
passport_1.default.deserializeUser(function (id, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.BaseUser.findById(id);
            done(null, user);
        }
        catch (error) {
            done(error);
        }
    });
});
//The route that starts the google auth process
route.get("/auth/google/onboard", (req, res) => {
    const serverResponse = new http_1.ServerResponse(req);
    passport_1.default.authenticate("google", { scope: ["profile", "email"] })(req, serverResponse);
    res.status(200).json((0, customResponse_1.successResponse)({ redirect: serverResponse.getHeader("location") }, 200, 'You are being redirected'));
});
route.get("/auth/google/redirected", passport_1.default.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/login",
}));
//Logic for returning users sign-in
route.get("/success", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.isAuthenticated()) {
        console.log(req.user.email);
        const user = yield user_1.BaseUser.findOne({ email: req.user.email });
        const token = user === null || user === void 0 ? void 0 : user.generateJWT(process.env.JWT_SECRET);
        // res.cookie("token", token, {
        //   httpOnly: false,
        //   sameSite: "none",
        //   secure: true,
        // });
        // return res.redirect(
        //   `http://localhost:5500/skyskill.html?email=${user.email}&name=${user.name}`
        // );
        // const encryptedToken = cryptoJs.AES.encrypt(token, process.env.crypto_key).toString();
        return res.redirect(`${process.env.CLIENT_URL}/dashboard?payload=${encodeURIComponent(
        // encryptedToken
        token)}&email=${user === null || user === void 0 ? void 0 : user.email}&name=${user === null || user === void 0 ? void 0 : user.name}&token="csrf"`);
    }
    else {
        res.json(new customErrors_1.Unauthenticated("User unauthenticated"));
    }
}));
route.get("/login", (req, res) => {
    res.send("you have to login");
});
exports.default = route;
