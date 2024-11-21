
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { optimizeImageToWebp,uploadToCloudinary } from '../utils/cloudinaryConfig';
import { BadRequest } from '../errors/customErrors';
import Store from '../store/store';
const {maxImageToBeUploaded} = new Store()
// Multer configuration to use memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Middleware to handle multiple image uploads and conversion
export const uploadAndConvertToWebp = async (req: Request, res: Response, next: NextFunction) => {
  
  
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new BadRequest('No files uploaded');
    }

    if(req.files.length>maxImageToBeUploaded){
      throw new BadRequest(`A maximum of ${maxImageToBeUploaded} images can be uploaded`);
    }
    const uploadedImages = [];

    // Iterate through each file and convert/upload them
    for (const file of req.files) {
      const webpBuffer = await optimizeImageToWebp(file.buffer);

      if (!webpBuffer) {
        return res.status(400).json(new BadRequest("Converting pictures to WEBP format failed"))
      }

      // Upload the converted image to Cloudinary
      const result = await uploadToCloudinary(webpBuffer, 'THHSN');
      uploadedImages.push(result); // Collect the uploaded image data
    }

    // Store all uploaded images in `req.body` for later use in the controller
    req.body.uploadedImages = uploadedImages;

    next(); // Proceed to the next middleware/controller
  } catch (error:any) {
    console.log('Error processing files:', error);
    res.status(400).json(new BadRequest(error.message||"Error processing files"))
  }
};
