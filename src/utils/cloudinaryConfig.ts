// cloudinaryUtils.ts
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import { configDotenv } from 'dotenv';

configDotenv();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// Function to convert an image buffer to WebP format using sharp
export const optimizeImageToWebp = async (buffer: Buffer): Promise<Buffer | null> => {
  try {
    const converted = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();
    return converted;
  } catch (err: any) {
    console.log('Error converting image:', err.message);
    return null;
  }
};

// Function to upload the WebP image to Cloudinary
export const uploadToCloudinary = (buffer: Buffer, folderName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName, format: 'webp' },
      (error: any, result: any) => {
        if (error) {
          console.log('Cloudinary Upload Error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};
