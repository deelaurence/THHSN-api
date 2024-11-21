import { Request, Response } from 'express';
import { BaseProduct, IProductType } from '../models/products';
import { StatusCodes } from 'http-status-codes';
import { BadRequest, NotFound, InternalServerError } from '../errors/customErrors';
import { successResponse } from '../utils/customResponse';
import {v2 as cloudinary} from 'cloudinary'




// Create a new product
const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, description, quantity, price } = req.body;
    console.log(req.body);
    if (!name || !category || !quantity || !price) {
      throw new BadRequest('Please supply Product Name, Category, Quantity, and Price');
    }

    const newProduct: IProductType = await BaseProduct.create(req.body);

    res.status(StatusCodes.CREATED).json(successResponse(newProduct, StatusCodes.CREATED, 'Product created successfully'));
  } catch (error: any) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new InternalServerError(error.message));
  }
};

// Get a product by ID
const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await BaseProduct.findById(id);

    if (!product) {
      throw new NotFound('Product not found');
    }

    res.status(StatusCodes.OK).json(successResponse(product, StatusCodes.OK, 'Product retrieved successfully'));
  } catch (error: any) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new InternalServerError(error.message));
  }
};

// Update a product by ID
const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;


    const updatedProduct = await BaseProduct.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    
    if (!updatedProduct) {
      throw new NotFound('Product not found for update');
    }


    res.status(StatusCodes.OK).json(successResponse(updatedProduct, StatusCodes.OK, 'Product updated successfully'));
  } catch (error: any) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new InternalServerError(error.message));
  }
};

const updateProductImage = async (req: Request, res: Response) => {
  try {
    // const { id } = req.params;

    // const product = await BaseProduct.findById(id);
    // if (!product) {
    //   throw new NotFound('Product not found');
    // }

    const uploadedImages = req.body.uploadedImages;

    if (!uploadedImages || uploadedImages.length === 0) {
      return res.status(400).send('No images uploaded');
    }

    // Use the image URLs or data as needed
    // For example, save each `uploadedImage.secure_url` to your database

    const imageUrls = uploadedImages.map((image: any) => image.secure_url);

    res.status(200).json({ message: 'Images updated successfully', imageUrls });
  } catch (error: any) {
    console.log('error uploading image')
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new InternalServerError(error.message));
  }
};


// Delete a product by ID
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedProduct = await BaseProduct.findByIdAndDelete(id);

    if (!deletedProduct) {
      throw new NotFound('Product not found for deletion');
    }

    res.status(StatusCodes.OK).json(successResponse({}, StatusCodes.OK, 'Product deleted successfully'));
  } catch (error: any) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new InternalServerError(error.message));
  }
};

export {
  addProduct,
  getProduct,
  updateProduct,
  updateProductImage,
  deleteProduct,
};
