import dotenv from "dotenv";
dotenv.config();
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../utils/customResponse";
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import Store from "../store/store";
import axios from "axios";
import paystack from 'paystack'
import { BaseUser } from "../models/user";
import Payment from "../models/payment";
import { BadRequest, NotFound, Unauthenticated, InternalServerError, Conflict } from "../errors/customErrors";
import { hotError } from "../errors/hotError";

import crypto from "crypto";
import { BaseProduct } from "../models/products";
import { updateStockAfterPayment } from "../utils/updateStock";

const secretKey = process.env.paystack_key;
const clientUrl = process.env.CLIENT_URL
const _paystack = paystack(secretKey);

let payingUserCache;
const store = new Store();
const dateFormat=store.formatDate


// async function bulkUpdatePayments() {
//   try {
//       const result = await Payment.updateMany(
//           {}, // Empty filter updates all documents
//           { $set: { deliveryStatus: 'pending' } } // Adds or updates deliveryStatus
//       );
//       console.log(`${result.modifiedCount} payments updated successfully.`);
//   } catch (error) {
//       console.error('Error updating payments:', error);
//   }
// }

// // Call the function
// bulkUpdatePayments();
export const chargePayment = async (req:Request, res:Response) => {
  try {
    // Create a new transaction 
    
    const userId = req.decoded?.id;
    const user = await BaseUser.findOne({ _id: userId });
    let {grandTotal,description}=req.body;
    grandTotal=grandTotal*100

    if (!user) {
      throw new NotFound("User not found");
    }

    user.phoneNumber=req.body.telephone
    user.address=req.body.address
    user.firstName=req.body.firstName
    user.lastName=req.body.lastName
    user.state=req.body.selectedState
    user.city=req.body.selectedCity

    await user.save()

    if(!grandTotal){
        throw new BadRequest("Supply description and amount")
    }
 

    const transaction = await _paystack.transaction.initialize({
      amount:grandTotal, // Amount in kobo (100000 kobo = ₦1,000)
      email: user.email,
      metadata: {
        description:req.body,
        name: user.name||user.firstName||user.lastName||"Anonymous",
      },
    });
    
    // console.log(req.body) 
    // return

    // Redirect )the customer to the payment page
    res.json(successResponse(
        {redirect:transaction.data.authorization_url},
        200,
        "Succesfully Initialized payment"
    ));
  } catch (error:any) {
    hotError(error,res) 
  }
};

//webhook verification
function verifyWebhookSignature(headerSignature:string | string[] | undefined, requestPayload:string) {
  const computedSignature = crypto
  //@ts-ignore
    .createHmac("sha512", secretKey)
    .update(requestPayload)
    .digest("hex");
  return headerSignature === computedSignature;
}

export const webhookVerification = async (req:Request, res:Response) => {
  // Verify the signature
  try{

  const headerSignature = req.headers["x-paystack-signature"];
  const isSignatureValid = verifyWebhookSignature(
    headerSignature,
    JSON.stringify(req.body)
  );
  if (!isSignatureValid) {
    res.status(400).send("Invalid signature");
    return;
  }
  
  // Process the webhook event
  const event = req.body;
  const eventType = event.event;
  const eventData = event.data;
  const payloadEmail = eventData.customer.email;
  const payloadDescription = eventData.metadata.description;
  const payloadReference = eventData.reference;
  const payloadAmount = eventData.amount;
  const payloadName = eventData.metadata.name;
  const payloadAuth = eventData.authorization.authorization_code;
  // Handle the event based on the event type
  if (eventType === "charge.success") {
    // Find the paying user
    const payingUser = await BaseUser.findOne({ email: payloadEmail });

    // Save eventData to db
    await Payment.create({
      owner: payloadEmail,
      id: uuidv4(),
      name: payloadName,
      merchant: "paystack",
      date: dateFormat(),
      status: "Success",
      paystackAuthorization: payloadAuth,
      amount: payloadAmount / 100,
      description: payloadDescription,
      reference: payloadReference,
    });


    await updateStockAfterPayment(payloadDescription);



  } else if (eventType === "charge.failed") {
    await Payment.create({
      owner: payloadEmail,
      id: uuidv4(),
      name: payloadName,
      date: dateFormat(),
      status: "Failed",
      amount: payloadAmount / 100,
      description: payloadDescription,
      reference: payloadReference,
    });
    // Handle failed payment event
    console.log("Payment failed.");
    // Take appropriate actions like notifying the user, logging the failure, etc.
  } else if (eventType === "charge.refunded") {
    // Handle refunded payment event
    console.log("Payment refunded.");
    await Payment.create({
      owner: payloadEmail,
      id: uuidv4(),
      name: payloadName,
      date: dateFormat(),
      status: "Refunded",
      amount: payloadAmount / 100,
      description: payloadDescription,
      reference: payloadReference,
    });
  } else {
    // Handle other events as needed
    console.log(eventType);
  }
  // Respond with a success status
  res.sendStatus(200);
} catch (error:any) {
  console.error(error)
  res.status(400).send("Error in webhook verification");
}
}; 









// Handle the callback URL
export const verifyPaymentCallback = async (req:Request, res:Response) => {
  try {
    const reference = req.query.reference;

    // Verify the transaction
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.paystack_key}`,
        },
      }
    );
    // Process the transaction response
    if (response.data.data.status === "success") {
      // res.json({message:"payment sucessful"})
      console.log("Payment successful");
      const amount = response.data.data.amount / 100;
      const description = response.data.data.metadata.description;
      const name = response.data.data.metadata.name;
      const reference = response.data.data.reference;
      res.redirect(
        `${clientUrl}/receipt?amount=${amount}&description=${JSON.stringify(description)}&reference=${reference}&name=${name}`
      ); 
    } else {
      // Payment is not successful 
      // Do something here (e.g., display an error message, handle failed payment)
      console.log("Payment not successful");
    }
  } catch (error) {  
    console.error("Verification error:", error);
    res.status(500).send("Verification error");
  }
}; 



// const getSinglePayment = async (req, res) => {
//   try {
//     const PaymentId = req.params.id;
//     let query = {
//       _id: PaymentId, 
//     };
//     //admin requests have req.decoded
//     if (req.decoded) {
//       query = { id: PaymentId };
//     }
//     const singlePayment = await Payment.findOne(query);
//     if (!singlePayment) {
//       throw new NotFound(`no Message with id ${PaymentId} `);
//     }
//     res.status(200).json(singlePayment);
//   } catch (error) {
//     console.log(error.message);
//     res.status(400).json({ message: error.message });
//   }
// };
// const getPayments = async (req, res) => {
//   try {
//     let query = {};
//     console.log(req.decoded);
//     //Requests coming from admin passses thru middleware
//     if (req.decoded) {
//       query = { owner: req.decoded.id };
//     }

//     const allPayments = await Payment.find().sort({ _id: -1 });
//     // .skip(pageOptions.page * pageOptions.limit)
//     // .limit(pageOptions.limit);
//     if (allPayments.length < 1) {
//       throw new NotFound("No Payment found");
//     }
    
//     res.status(200).json(allPayments);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//     console.log(error.message);
//   }
// };

