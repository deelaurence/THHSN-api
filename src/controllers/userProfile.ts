import { Request, Response, raw } from 'express';
import  { Resume, IResume } from '../models/resume';
import { StatusCodes } from 'http-status-codes';
import { successResponse } from '../utils/customResponse';
import { BadRequest, NotFound, Unauthenticated, InternalServerError, Conflict } from "../errors/customErrors";
import {BaseUser, IUser} from '../models/user';



//Create new resume and return the ID
const getUserProfile = async(req:Request, res:Response): Promise<void>=>{
  try {
    const userId = req?.decoded?.id;
    
    const userProfile = await BaseUser.findById(userId)
    .populate({
      path: 'resumes', // Populate resumes
      populate: [
        { path: 'jobExperiences.responsibilities' }, // Populate responsibilities
        { path: 'jobExperiences.rawResponsibilities' } // Populate rawResponsibilities
      ]
    });

    //Push resume into resumes field in user object
    res.status(201).json(successResponse(
      userProfile,StatusCodes.CREATED,"This is the updated user profile"
    ));
  } catch (error:any) {
     // Handle errors 
     console.error(error)
     res.status(StatusCodes.INTERNAL_SERVER_ERROR)
     .json(new InternalServerError(error.message));
  }
}

export{
    getUserProfile
}
