// Cloudinary Upload Function
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath, folder) => {
  let cloudinaryResult;
  try {
    cloudinaryResult = await cloudinary.uploader.upload(filePath, {
      folder,
    });
    console.log('✅ Cloudinary Upload Result:', cloudinaryResult);

    if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    await fs.unlink(filePath);
    return cloudinaryResult;
  } catch (error) {
    console.error('❌ Cloudinary Upload Error:', error);
    await fs.unlink(filePath).catch(console.error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export default uploadToCloudinary;
