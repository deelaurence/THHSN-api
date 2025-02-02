import Payment from "../models/payment";
import { successResponse } from "../utils/customResponse";
import { InternalServerError } from "../errors/customErrors";
import { StatusCodes } from "http-status-codes";
import { Request,Response } from "express";


const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const payments = await Payment.find().sort({_id:-1})
  
      res.status(StatusCodes.OK).json(successResponse(
        payments, StatusCodes.OK, "List of all payments"
      ));
    } catch (error: any) {
      // Handle errors
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(new InternalServerError(error.message));
    }
  }
  export{
      getAllOrders
  }