import auth from '../middleware/authentication';
import express from 'express';
const route = express.Router()
import verifyCart from '../middleware/verifyCart';
import { chargePayment, verifyPaymentCallback,webhookVerification } from '../controllers/paystackPayment';

route.post("/paystack/initiate", auth, verifyCart, chargePayment);
route.get("/paystack/callback", verifyPaymentCallback);
route.post("/paystack/webhook", webhookVerification); 
 
export default route;