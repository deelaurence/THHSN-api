import { Request, Response } from 'express';
import { BaseProduct, IProductType } from '../models/products';
import { StatusCodes } from 'http-status-codes';
import { BadRequest, NotFound, InternalServerError } from '../errors/customErrors';
import { successResponse } from '../utils/customResponse';
import {v2 as cloudinary} from 'cloudinary'




// Create a new product
const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, description,  } = req.body;
    if (!name || !category ) {
      throw new BadRequest('Please supply Product Name and Category');
    }
    const productExists:IProductType|null = await BaseProduct.findOne({name})
    if(productExists) throw new BadRequest("Product name already exusting, Do you mind editing instead?")
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
// Get products that all fields are completed
const getProducts = async (req: Request, res: Response) => {
  try {
    const referer = req.headers.referer ? req.headers.referer.replace(/\/$/, '') : '';
    const products = await BaseProduct.aggregate([
      {
        $match: {
          images: { $exists: true, $not: { $size: 0 } },
          variations: { $exists: true, $not: { $size: 0 } },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $addFields: {
          coverImage: {
            $cond: {
              if: { $ifNull: ["$coverImage", false] }, // Check if coverImage exists
              then: { $concat: [referer, "$coverImage"] }, // Concatenate prefix
              else: null, // Leave it as null if not present
            },
          },
        },
      },
    ]);
    

    
    
    res.status(StatusCodes.OK).json(successResponse(products, StatusCodes.OK, 'Product retrieved successfully'));
  } catch (error: any) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new InternalServerError(error.message));
  }
};

// Update product name and description
const updateProductNameAndDescription = async (req: Request, res: Response) => {
  try { 
    const { id } = req.params;
    const { name, category, description,  } = req.body;
    if (!name || !category ) {
      throw new BadRequest('Please supply Product Name and Category');
    }
    const updatedProduct = await BaseProduct.findByIdAndUpdate(id, {
      name,
      category,
      description
    }, {
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


// Update a product variation
const updateProductVariation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;


    const updatedProduct = await BaseProduct.findByIdAndUpdate(id, {variations:updateData}, {
      new: true,
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


//Update product Image
const updateProductImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await BaseProduct.findById(id);
    if (!product) {
      throw new NotFound('Product not found');
    }

    const uploadedImages = req.body.uploadedImages;

    if (!uploadedImages || uploadedImages.length === 0) {
      throw new BadRequest("No Image Uploaded")
    }

    const imageUrls = uploadedImages.map((image: any) => image.secure_url);

    const updatedProduct = await BaseProduct.findByIdAndUpdate(
      product._id,{
        // $push:{
        //   images:{
        //     $each:imageUrls
        //   }
        // }
        images:imageUrls
      },{
        new:true
      }
    )

    res.json(successResponse(updatedProduct,201,"Images added to product"));
  } catch (error: any) {
    console.log('error uploading image')
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new InternalServerError(error.message));
  }
};


// Update product bestseller and newArrival status
const updateProductBestsellerAndNewArrival = async (req: Request, res: Response) => {
  try { 
    const { id } = req.params;
    const { bestSeller, newArrival } = req.body;
    if (bestSeller === undefined && newArrival === undefined) {
      throw new BadRequest('Please supply Bestseller and New Arrival');
    }
    const updatedProduct = await BaseProduct.findByIdAndUpdate(id, {
      bestSeller,
      newArrival
    }, {
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


// Choose bestseller and newArrival cover image
const bestsellerAndNewArrivalCoverImage = async (req: Request, res: Response) => {
  try { 
    const { id } = req.params;
    const { coverImage } = req.body;
    if (coverImage === undefined) {
      throw new BadRequest('Please supply Image');
    }
    
    const updatedProduct = await BaseProduct.findByIdAndUpdate(id, {
      coverImage
    },{
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
  updateProductNameAndDescription,
  updateProductBestsellerAndNewArrival,
  bestsellerAndNewArrivalCoverImage,
  updateProductImage,
  updateProductVariation,
  deleteProduct,
  getProducts
};
