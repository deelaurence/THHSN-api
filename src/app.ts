import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import adminAuthRoutes from './routes/adminAuth';
import productRoutes from './routes/product';
import cron from 'node-cron'
import publicProductRoutes from './routes/publicProducts'
import airoutes from './routes/Ai'
const swaggerDocument = require('./swagger-output.json');
import resumeRoutes from './routes/dataCollection'
import { Secret } from 'jsonwebtoken';
import  dotenv from 'dotenv' 
import passport from 'passport'; 
import shippingRoutes from './routes/shipping'
import profileRoutes from './routes/userProfile'
import googleRoutes from './routes/googleAuth'
import morgan from 'morgan'
import swaggerUI from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { NotFound } from './errors/customErrors';
import session from 'express-session'

import cors from 'cors'
import paymentRoute from './routes/payment';
dotenv.config()



const app = express();
const PORT = process.env.PORT || 3000;



//express session is needed for passport to work
app.use(
  session({
    secret: "replace-with-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cors({
  origin:'*',
  credentials:true
}))


app.use(morgan("dev"))
// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

//PASSPORT AND EXPRESS SESSION MIDDLEWARES MUST BE
//INITIALIZED BEFORE CALLING PASSPORT ROUTES
//THE ORDER MATTERS TOO EXPRESS SESSION, THEN PASSPORT

 

// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

 
app.get('/wake',(req,res)=>{
  res.json({message:"Service awake!!"})
})
app.use(bodyParser.json());
app.use("/", googleRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/admin/auth', adminAuthRoutes);
app.use('/v1/admin/manage', productRoutes);
app.use('/v1/public',publicProductRoutes)
app.use('/v1/prompt', airoutes) 
app.use('/v1/resume', resumeRoutes)
app.use('/v1/profile', profileRoutes)
app.use('/v1/payment', paymentRoute)
app.use('/v1/shipping', shippingRoutes)
app.use("/v1/docs", swaggerUI.serve, swaggerUI.setup(require('./docs')));
app.set('trust proxy',1);    
app.use("*",(req,res)=>{  
  console.log("Route not found")
  res.status(404).json(new NotFound("Requested resource not found"))
})
const connectionString:string = process.env.MONGODB_URI||''

mongoose.connect(connectionString);


cron.schedule('*/8 * * * *', () => {
  makeApiRequest();
});


const apiEndpoints:string[]=['https://wake-up-skyskill.onrender.com']

// Function to make the API request using Axios
async function makeApiRequest() {
  try {
    apiEndpoints.forEach(async (endpoint)=>{
      const response = await axios.get(endpoint);
      console.log(response.data);

    })
  } catch (error:any) {
    console.error('Error during API request:', error.message);
  }
}






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}..`);
});

export default app;
