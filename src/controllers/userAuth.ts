require("dotenv").config();
import {BaseUser, IUser} from '../models/user';
import { IResume } from '../models/resume';
// const crypto = require("crypto");
import { Request, Response } from 'express';

import { sendBrevoMail, sendPasswordResetMail } from "../utils/brevomail";
import { isValidNameInput } from "../utils/nameFormat";
import { StatusCodes } from "http-status-codes";
// import generator from "generate-serial-number";
// const serialNumber = generator.generate(1);
import jwt,{JwtPayload, Secret} from "jsonwebtoken";
import bcrypt from "bcryptjs";
// import helpers from "../../helpers";

import { successResponse } from '../utils/customResponse';
import { BadRequest, NotFound, Unauthenticated, InternalServerError, Conflict } from "../errors/customErrors";



const register = async (req:Request, res:Response) => {
  try {
    
    // #swagger.tags = ['Onboarding']
    
    if (!req.body.name || !req.body.email) {
      throw new BadRequest(
        "Supply Name, Password and Email"
      );
    }
    if (!isValidNameInput(req.body.name)) {
      throw new BadRequest(
        "Enter both Lastname and Firstname, No compound names"
      );
    }
    const existingUser = await BaseUser.findOne({ email: req.body.email });
    if (existingUser) {
      if (!existingUser.verified) {
        await BaseUser.findOneAndDelete({ email: req.body.email });
        throw new Conflict(`Didn't get email the first time? make sure '${req.body.email}' is a valid email.`);
      }
      throw new Conflict("You are already registered, Log in");
    }
    const newUser:IUser = await BaseUser.create(req.body);
 
    const token = newUser.generateJWT(process.env.JWT_SECRET as Secret);
    
    //send Email
    if (!req.body.verified) {
        const link = `${process.env.SERVER_URL}/auth/verify-email/${token}`;
        const mailStatus = await sendBrevoMail(
        req.body.email,
        req.body.name,
        link
      );

      //If mail sending failed delete user from database
      if (mailStatus != 201) {
        await BaseUser.findOneAndDelete({ email: req.body.email });
        throw new InternalServerError(
            "Something went wrong while trying to send verification email, try again later"
        );
      }
    }

    res
    .status(StatusCodes.CREATED)
    .json(successResponse(
      {
      name: newUser.name,
      email: newUser.email,
      phonenumber: newUser.phoneNumber,
      gender: newUser.gender,
      country: newUser.country,
    },StatusCodes.CREATED,
    "To continue your registration, click the link sent to your email"
    ));
  } catch (error:any) {
    console.log(error.message);
    if (error.code === 11000 || error.statusCode === 409) {
      res
        .status(StatusCodes.CONFLICT)
        .json(new Conflict(error.message));
      return;
    }
    if(error.statusCode==400){
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(new BadRequest(error.message));
      return;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(new InternalServerError(error.message));
  }
};

//After registration an email is sent.
//clicking on the link runs this logic
const verifyEmail = async (req:Request, res:Response) => {
  try {
    const token = req.params.signature;
    const secret:any = process.env.JWT_SECRET
    const payload = jwt.verify(token, secret) as JwtPayload;
    const user = await BaseUser.findOneAndUpdate(
      { _id: payload.id },
      { verified: true }
    );
    // console.log(user?._id)
    const clientUrl = `${process.env.CLIENT_URL}/auth/log-in`;
    res.status(StatusCodes.PERMANENT_REDIRECT).redirect(clientUrl);
  } catch (error:any) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

//logic sends email before password reset
const verifyEmailPasswordReset = async (req:Request, res:Response) => {
  try {
    const user = await BaseUser.findOne({ email: req.body.email });
    
    if (!user) {
      throw new NotFound("User not found, Check email again or Register");
    }

    if (user) {
      if (user && user.provider) {
        res
          .status(StatusCodes.CONFLICT)
          .json({ message: "This account was registered with Google Sign-In" });
        return;
      }
    }

    const token = user.generateJWT(process.env.JWT_SECRET as Secret);
    const link = `${process.env.SERVER_URL}/auth/verified-email-password-reset/${token}`;
    const mailStatus = await sendPasswordResetMail(
      req.body.email,
      user.name,
      link
    );
    console.log(mailStatus);
    if (mailStatus != 201) {
      throw new InternalServerError(
        "Something went wrong while trying to send verification email, try again later"
      );
    }
    return res.json(successResponse({},
      StatusCodes.OK,
      `An Email has been sent to ${req.body.email} follow the instructions accordingly`));
  } catch (error:any) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST)
    .json(error);
  }
};

//Logic called when email link is clicked
const verifiedEmailPasswordReset = async (req:Request, res:Response) => {
  try {
    console.log(req.params.signature)
    const token = req.params.signature;
    const secret:any = process.env.JWT_SECRET
    const payload = jwt.verify(token, secret ) as JwtPayload;
    const user = await BaseUser.findOneAndUpdate(
      { _id: payload.id },
      { canResetPassword: true });
    //Redirect to a client page that can display the email
    //and prompt the user for thier new password
    const userEmail:any = user?.email
    res
      .status(StatusCodes.PERMANENT_REDIRECT)
      .redirect(
        `${process.env.CLIENT_URL}/auth/reset-password/?email=${encodeURIComponent(
          userEmail
        )}`
      );
  } catch (error:any) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

//Update password after email has
//been verified for password reset
const updatePassword = async (req:Request, res:Response) => {
  try {
    if(!req.body.password||!req.body.email){
      throw new BadRequest("Supply user email and new password")
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = await BaseUser.findOne({ email: req.body.email });
    if (!user) {
      throw new BadRequest(
        "User with the supplied email not found"
      );
    }
    if (!user?.canResetPassword) {
      throw new BadRequest(
        "You need to verify email before resetting password!"
      );
    }
    const edited = await BaseUser.findOneAndUpdate(
      {
        email: req.body.email,
      },
      { password: hashedPassword, canResetPassword: false },
      { new: true, runValidators: true }
    );
    res.json(successResponse(
      {},
      StatusCodes.OK,"Password Reset Successful"));
  } catch (error:any) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const login = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequest("email and password cannot be empty");
    }
    
    const user = await BaseUser.findOne({ email: email })
        .populate({path:'resumes'});


    if (!user) {
      throw new NotFound("Email not registered, Sign up");
    }


    //if user registerd via google
    if (user.provider == "google") {
      throw new BadRequest("You registered with google sign in");
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      throw new Unauthenticated("Invalid credentials");
    }
    if (!user.verified) {
      throw new Unauthenticated("Verify your email");
    }
    
    const token = user.generateJWT(process.env.JWT_SECRET as Secret);
    
    return res.status(StatusCodes.OK).
    json(successResponse({
      token: token,
      email: user.email,
      name: user.name,
      phonenumber: user.phoneNumber,
      gender: user.gender,
      country: user.country,
      resumes: user.resumes
    },StatusCodes.OK,'Welcome back'));
  } catch (error:any) {
    const { message, statusCode } = error;
    if (statusCode) {
      res.status(statusCode).json( error);
      console.log(statusCode, message);
      return;
    }
    res.status(StatusCodes.UNAUTHORIZED).json(error);
    console.log(message);
  }
};

// const logout = (req, res) => {
//   res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
//   res.json({ message: "logged out" });
// };

const deleteUser = async (req:Request, res:Response) => {
  try {
    const email = req.params.email;
    const user = await BaseUser.findOneAndDelete({ email });
    if (!user) {
      throw new NotFound(`${email} does not exist`);
    }
    res.status(StatusCodes.OK).json({ message: `${email} removed` });
  } catch (error:any) {
    console.error(error);
    res.status(error.statusCode).json({ error: error.message });
  }
};

const updateUser = async (req:Request, res:Response) => {
  try {
    const {
      phoneNumber,
      onWhatsapp,
      gender,
      levelOfExpertise,
      employmentStatus,
      state,
      country,
      referralStatus,
    } = req.body;
    const user = await BaseUser.findById(req.decoded?.id);

    let fieldToUpdate = onWhatsapp?{onWhatsapp}:{
      phoneNumber,
      gender,
      levelOfExpertise,
      employmentStatus,
      state,
      country,
      referralStatus
    }


    const userupdate = await BaseUser.findOneAndUpdate(
      { _id: req.decoded?.id },
      fieldToUpdate,
      { new: true }
    );


    res
      .status(200)
  } catch (error:any) {
    if (error.status)
      return res
        .status(error.status)
  }
};

const getUser = async (req:Request, res:Response) => {
  try {
    const { email } = req.params;
    const user = await BaseUser.findOne({ email });
    
    
  } catch (error:any) {
    if (error.status)
      return res
        .status(error.status)
  }
};

export {
  register,
  login,
  deleteUser,
  verifyEmail,
  verifiedEmailPasswordReset,
  verifyEmailPasswordReset,
  updatePassword,
  updateUser,
  getUser,
  // getUserByToken
};
