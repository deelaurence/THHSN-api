import { Request, Response } from 'express';
import Shipping from '../models/shipping'; // Adjust the path based on your folder structure
import { StatusCodes } from 'http-status-codes';
import { BadRequest, NotFound, InternalServerError } from '../errors/customErrors';
import { successResponse } from '../utils/customResponse';

// Create new shipping entries in bulk or update existing ones
export const createShipping = async (req: Request, res: Response) => {
    try {
        const shippingEntries = req.body.states; // Expecting an array of objects

        if (!Array.isArray(shippingEntries) || shippingEntries.length === 0) {
            throw new BadRequest('An array of shipping entries is required.');
        }

        // Validate each entry
        for (const entry of shippingEntries) {
            if (!entry.location || typeof entry.price !== 'number') {
                throw new BadRequest('Each shipping entry must include a valid location and price.');
            }
        }
        // Delete all existing shipping entries
        await Shipping.deleteMany({});

        // Insert new shipping entries
        const results = await Shipping.insertMany(shippingEntries);

        res
            .status(StatusCodes.CREATED)
            .json(successResponse(results, StatusCodes.CREATED, 'Shipping entries created or updated successfully'));
    } catch (error: any) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new InternalServerError(error.message));
    }
};
// Get all shipping entries
export const getAllShipping = async (req: Request, res: Response) => {
  try {
    const shippingEntries = await Shipping.find();

    res
      .status(StatusCodes.OK)
      .json(successResponse(shippingEntries, StatusCodes.OK, 'Shipping entries retrieved successfully'));
  } catch (error: any) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new InternalServerError(error.message));
  }
};


// Get all shipping entries where the price has been populated
export const getAvailableShipping = async (req: Request, res: Response) => {
    try {
      const shippingEntries = await Shipping.find({ price: { $gt: 0 } });
      res
        .status(StatusCodes.OK)
        .json(successResponse(shippingEntries, StatusCodes.OK, 'Shipping entries retrieved successfully'));
    } catch (error: any) {
      console.error(error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new InternalServerError(error.message));
    }
  };

// Get a single shipping entry by ID
export const getShippingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const shippingEntry = await Shipping.findById(id);

    if (!shippingEntry) {
      throw new NotFound('Shipping entry not found.');
    }

    res
      .status(StatusCodes.OK)
      .json(successResponse(shippingEntry, StatusCodes.OK, 'Shipping entry retrieved successfully'));
  } catch (error: any) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new InternalServerError(error.message));
  }
};

// Update a shipping entry by ID
export const updateShipping = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { location, price } = req.body;

    if (!location || !price) {
      throw new BadRequest('Location and price are required.');
    }

    const updatedShipping = await Shipping.findByIdAndUpdate(
      id,
      { location, price },
      { new: true, runValidators: true }
    );

    if (!updatedShipping) {
      throw new NotFound('Shipping entry not found.');
    }

    res
      .status(StatusCodes.OK)
      .json(successResponse(updatedShipping, StatusCodes.OK, 'Shipping entry updated successfully'));
  } catch (error: any) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new InternalServerError(error.message));
  }
};

// Delete a shipping entry by ID
export const deleteShipping = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedShipping = await Shipping.findByIdAndDelete(id);

    if (!deletedShipping) {
      throw new NotFound('Shipping entry not found.');
    }

    res
      .status(StatusCodes.OK)
      .json(successResponse(null, StatusCodes.OK, 'Shipping entry deleted successfully'));
  } catch (error: any) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new InternalServerError(error.message));
  }
};
