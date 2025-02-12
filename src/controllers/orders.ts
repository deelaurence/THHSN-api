import Payment from "../models/payment";
import { successResponse } from "../utils/customResponse";
import { BadRequest, InternalServerError, NotFound } from "../errors/customErrors";
import { StatusCodes } from "http-status-codes";
import { Request,Response } from "express";
import { BaseUser } from "../models/user";


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


const getAllUserOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await BaseUser.findById(req.decoded?.id)
      if(!user){
        throw new NotFound("User not found")
      }
      const order = await Payment.find({owner:user.email}).sort({_id:-1})
  
      res.status(StatusCodes.OK).json(successResponse(
        order, StatusCodes.OK, "User orders"
      ));
    } catch (error: any) {
      // Handle errors
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(new InternalServerError(error.message));
    }
}
const getOneOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const payment = await Payment.findOne({
        reference:req.body.reference
      })
      res.status(StatusCodes.OK).json(successResponse(
        payment, StatusCodes.OK, "Order fetched"
      ));
    } catch (error: any) {
      // Handle errors
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(new InternalServerError(error.message));
    }
}

const shippingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reference, deliveryMessage, deliveryStatus } = req.body;

    //if there's only message update only message
    if(deliveryMessage&&reference){
      const updatedPayment=await Payment.findOneAndUpdate({reference},{deliveryMessage},{new:true})
      res.status(StatusCodes.OK).json(
        successResponse(updatedPayment, StatusCodes.OK, "Shipping status updated")
      );
      return 
    }
    

    if (!reference  || !deliveryStatus) {
      throw new BadRequest("Supply reference and deliveryStatus");
    }

    const currentTime = new Date().toLocaleString(); // Current timestamp

    const payment = await Payment.findOne({ reference });

    if (!payment) {
      throw new BadRequest("Payment reference not found");
    }

    const existingStatusIndex = payment.deliveryTimeline.findIndex(
      (entry: any) => entry.status === deliveryStatus
    );

    if (existingStatusIndex !== -1) {
      // If the status exists, update its time
      payment.deliveryTimeline[existingStatusIndex].time = currentTime;
    } else {
      // If the status does not exist, push a new object
      payment.deliveryTimeline.push({ status: deliveryStatus, time: currentTime });
    }

    // Update the deliveryStatus and deliveryMessage
    payment.deliveryStatus = deliveryStatus;

    // Save the changes
    await payment.save();

    res.status(StatusCodes.OK).json(
      successResponse(payment, StatusCodes.OK, "Shipping status updated")
    );
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      new InternalServerError(error.message)
    );
  }
};

export {
      getAllOrders,
      getAllUserOrders,
      getOneOrder,
      shippingStatus
}