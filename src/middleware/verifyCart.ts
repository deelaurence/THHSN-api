import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { configDotenv } from 'dotenv';
import { BadRequest } from '../errors/customErrors';
import { Request, Response, NextFunction } from 'express';
import { BaseProduct } from '../models/products';


const verifyCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('verifyCart start');

    const cart = req.body.cart;
    const allProducts = await BaseProduct.find();

    // Convert products into a Map for quick lookup
    const productMap = new Map();
    
    console.log(req.body.cartTotal);

    for (const product of allProducts) {
        productMap.set(product.name, product.variations.flatMap(v => v.variations));
    }

    let totalClientCartPrice=0
    for (const cartItem of cart) {
        if (!productMap.has(cartItem.name)) continue; // Skip if product does not exist
        totalClientCartPrice=totalClientCartPrice+(cartItem.price*cartItem.quantity)
        const variants = productMap.get(cartItem.name);
        //@ts-ignore
        const matchingVariant = variants.find(v => v.variation === cartItem.variant.name);

        if (matchingVariant) {
            if(matchingVariant.price !== cartItem.price){

                throw new BadRequest('Price mismatch');
            }
            
            // next()
        }
    }
    console.log(totalClientCartPrice,req.body.cartTotal)
    if(totalClientCartPrice!==req.body.cartTotal){
        throw new BadRequest('Price and quantity mismatch');
    }

    console.log('verifyCart end, next');
    next();

  } catch (error: any) {

    // If the error has a custom statusCode, use it; otherwise, default to 401
    const statusCode = error.statusCode || StatusCodes.BAD_REQUEST;
    const message = error.message || 'Cart discrepancy';

    console.log(error)
    return res.status(statusCode).json(new BadRequest(message));
  }
};

export default verifyCart;
