require("dotenv").config();
import {BaseAdmin, IAdmin} from '../models/admin';
import { IResume } from '../models/resume';
// const crypto = require("crypto");
import { Request, Response } from 'express';

import { sendBrevoMail, sendPasswordResetMail } from "../utils/brevomail";
import { isValidNameInput } from "../utils/nameFormat";
import { StatusCodes } from "http-status-codes";
import jwt,{JwtPayload, Secret} from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { successResponse } from '../utils/customResponse';
import { BadRequest, NotFound, Unauthenticated, InternalServerError, Conflict } from "../errors/customErrors";



const register = async (req:Request, res:Response) => {
  try {
    
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
    const existingAdmin = await BaseAdmin.findOne({ email: req.body.email });
    if (existingAdmin) {
      throw new Conflict("You are already registered, Log in");
    }
    const newAdmin:IAdmin = await BaseAdmin.create(req.body);
 
    const token = newAdmin.generateJWT(process.env.JWT_SECRET as Secret);
    
    res
    .status(StatusCodes.CREATED)
    .json(successResponse(
      {
      name: newAdmin.name,
      email: newAdmin.email,
    },StatusCodes.CREATED,
    "Admin created successfully"
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

//logic sends email before password reset
const verifyEmailPasswordReset = async (req:Request, res:Response) => {
  try {
    const admin = await BaseAdmin.findOne({ email: req.body.email });
    
    if (!admin) {
      throw new NotFound("Admin not found, Check email again or Register");
    }

    const token = admin.generateJWT(process.env.JWT_SECRET as Secret);
    const link = `${process.env.SERVER_URL}/auth/verified-email-password-reset/${token}`;
    const mailStatus = await sendPasswordResetMail(
      req.body.email,
      admin.name,
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
    const admin = await BaseAdmin.findOneAndUpdate(
      { _id: payload.id },
      { canResetPassword: true });
    //Redirect to a client page that can display the email
    //and prompt the admin for thier new password
    const adminEmail:any = admin?.email
    res
      .status(StatusCodes.PERMANENT_REDIRECT)
      .redirect(
        `${process.env.CLIENT_URL}/auth/reset-password/?email=${encodeURIComponent(
          adminEmail
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
      throw new BadRequest("Supply admin email and new password")
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const admin = await BaseAdmin.findOne({ email: req.body.email });
    if (!admin) {
      throw new BadRequest(
        "Admin with the supplied email not found"
      );
    }
    if (!admin?.canResetPassword) {
      throw new BadRequest(
        "You need to verify email before resetting password!"
      );
    }
    const edited = await BaseAdmin.findOneAndUpdate(
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
    
    const admin = await BaseAdmin.findOne({ email: email })


    if (!admin) {
      throw new NotFound("Email not registered, Sign up");
    }

    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      throw new Unauthenticated("Invalid credentials");
    }
    
    const token = admin.generateJWT(process.env.JWT_SECRET as Secret);
    
    return res.status(StatusCodes.OK).
    json(successResponse({
      token: token,
      email: admin.email,
      name: admin.name
    },StatusCodes.OK,'Welcome back'));
  } catch (error:any) {
    const { message, statusCode } = error;
    if (statusCode) {
      res.status(statusCode).json(error);
      console.log(statusCode, message);
      return;
    }
    res.status(StatusCodes.UNAUTHORIZED).json(error);
    console.log(message);
  }
};


const deleteAdmin = async (req:Request, res:Response) => {
  try {
    const email = req.params.email;
    const admin = await BaseAdmin.findOneAndDelete({ email });
    if (!admin) {
      throw new NotFound(`${email} does not exist`);
    }
    res.status(StatusCodes.OK).json({ message: `${email} removed` });
  } catch (error:any) {
    console.error(error);
    res.status(error.statusCode).json({ error: error.message });
  }
};

const updateAdmin = async (req:Request, res:Response) => {
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
    const admin = await BaseAdmin.findById(req.decoded?.id);

    let fieldToUpdate = onWhatsapp?{onWhatsapp}:{
      phoneNumber,
      gender,
      levelOfExpertise,
      employmentStatus,
      state,
      country,
      referralStatus
    }


    const adminupdate = await BaseAdmin.findOneAndUpdate(
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

const getAdmin = async (req:Request, res:Response) => {
  try {
    const { email } = req.params;
    const admin = await BaseAdmin.findOne({ email });
    
    
  } catch (error:any) {
    if (error.status)
      return res
        .status(error.status)
  }
};

export {
  register,
  login,
  deleteAdmin,
  verifiedEmailPasswordReset,
  verifyEmailPasswordReset,
  updatePassword,
  updateAdmin,
  getAdmin,
};
