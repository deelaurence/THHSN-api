// uploadMiddleware.ts
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { optimizeImageToWebp,uploadToCloudinary } from '../utils/cloudinaryConfig';



// Multer configuration to use memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Middleware to handle multiple image uploads and conversion
export const uploadAndConvertToWebp = async (req: Request, res: Response, next: NextFunction) => {
console.log() 
if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).send('No files uploaded');
}

  try {
    const uploadedImages = [];

    // Iterate through each file and convert/upload them
    for (const file of req.files) {
      const webpBuffer = await optimizeImageToWebp(file.buffer);

      if (!webpBuffer) {
        return res.status(500).send('Failed to convert one or more images');
      }

      // Upload the converted image to Cloudinary
      const result = await uploadToCloudinary(webpBuffer, 'your_folder_name');
      uploadedImages.push(result); // Collect the uploaded image data
    }

    // Store all uploaded images in `req.body` for later use in the controller
    req.body.uploadedImages = uploadedImages;

    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.log('Error processing files:', error);
    res.status(500).send('Failed to process files');
  }
};
