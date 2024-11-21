import auth from '../middleware/authentication';
import express from 'express';
const route = express.Router()
import { chargePayment, verifyPaymentCallback,webhookVerification } from '../controllers/payment';

route.post("/paystack/initiate", auth, chargePayment);
route.get("/paystack/callback", verifyPaymentCallback);
route.post("/paystack/webhook", webhookVerification); 
 
export default route;
