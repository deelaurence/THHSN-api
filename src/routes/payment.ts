import auth from '../middleware/authentication';
import express from 'express';
const route = express.Router()
import verifyCart from '../middleware/verifyCart';
import { chargePayment, verifyPaymentCallback,webhookVerification } from '../controllers/paystackPayment';
import { getAllOrders } from '../controllers/orders';
import adminAuth from '../middleware/adminAuthentication';

route.post("/paystack/initiate", auth, verifyCart, chargePayment);
route.get("/paystack/callback", verifyPaymentCallback);
route.post("/paystack/webhook", webhookVerification); 

route.get("/all",adminAuth,getAllOrders)

 
export default route;