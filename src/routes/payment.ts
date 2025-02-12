import auth from '../middleware/authentication';
import express from 'express';
const route = express.Router()
import verifyCart from '../middleware/verifyCart';
import { chargePayment, verifyPaymentCallback,webhookVerification } from '../controllers/paystackPayment';
import { getAllOrders, getAllUserOrders, getOneOrder, shippingStatus } from '../controllers/orders';
import adminAuth from '../middleware/adminAuthentication';

route.post("/paystack/initiate", auth, verifyCart, chargePayment);
route.get("/paystack/callback", verifyPaymentCallback);
route.post("/paystack/webhook", webhookVerification); 

route.get("/all",adminAuth,getAllOrders)
route.post("/shipping-status", adminAuth, shippingStatus)
route.post("/single", auth, getOneOrder)
route.get("/all-user", auth, getAllUserOrders)

 
export default route;