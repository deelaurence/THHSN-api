import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { InternalServerError } from "./customErrors";

export const hotError = (error:any,res:Response)=>{
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(new InternalServerError(error.message));
}    