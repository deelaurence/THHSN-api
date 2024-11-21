import express from "express";
const route = express.Router();
import { BadRequest, Unauthenticated } from "../errors/customErrors";
import { successResponse } from "../utils/customResponse";
import { Secret } from "jsonwebtoken";
import { Request, Response } from "express";
import cryptoJs from 'crypto-js';
import passport from "passport";
const GoogleStrategy = require("passport-google-oauth20").Strategy;
import { BaseUser } from "../models/user";
import { IUser } from "../models/user";
import { ServerResponse } from "http";

interface User {
  email: string;
  // Add other properties as needed
}

interface AuthenticatedRequest extends Request {
  user: User;
}

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
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/redirected",
      passReqToCallback: true,
      scope: ["profile", "email"],
    },

    //Logic for new users
    async function verify(req:any, accessToken:string, refreshToken:string, profile:any, done:any) {

      try {
        if (req.authError) {
          console.error(req.authError);
        }
        // Check if the user already exists in the database
        const user = await BaseUser.findOne({ email: profile.emails[0].value });
        // console.log(profile)
        console.log("finding user");
        if (!user) {
          console.log("User has not registered before")
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
          localUser = await BaseUser.create({
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
        const existingUser = await BaseUser.findOne({ _id: localUser?._id });
        if (!existingUser) {
          return done(null, false);
        }

        return done(null, existingUser);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

//Configure passport serialization and deserialization
//serialize stores unique user info on the sessions (user._id)
passport.serializeUser(function (user:any, done) {
  done(null, user!._id);

});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await BaseUser.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

//The route that starts the google auth process
route.get("/auth/google/onboard", (req, res) => {
  const serverResponse = new ServerResponse(req);
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    serverResponse
  );
  res.status(200).json(successResponse(
    {redirect:serverResponse.getHeader("location")},
    200,
    'You are being redirected'));
});

route.get(
  "/auth/google/redirected",
  passport.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/login",
  })
);

//Logic for returning users sign-in
route.get("/success", async (req:any, res) => {
    if (req.isAuthenticated()) {
    console.log(req.user!.email);
    const user = await BaseUser.findOne({ email: req.user.email });
    const token:any = user?.generateJWT(process.env.JWT_SECRET as Secret);

    // res.cookie("token", token, {
    //   httpOnly: false,
    //   sameSite: "none",
    //   secure: true,
    // });
    // return res.redirect(
    //   `http://localhost:5500/skyskill.html?email=${user.email}&name=${user.name}`
    // );
    // const encryptedToken = cryptoJs.AES.encrypt(token, process.env.crypto_key).toString();
    return res.redirect(
      `${process.env.CLIENT_URL}/dashboard?payload=${encodeURIComponent(
        // encryptedToken
        token
      )}&email=${user?.email}&name=${user?.name}&token="csrf"`
    );


  } else {
    res.json( new Unauthenticated ("User unauthenticated") );
  }
});

route.get("/login", (req, res) => {
  res.send("you have to login");
});



export default route
