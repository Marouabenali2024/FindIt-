import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Import fs module for file system operations
import Item from '../../models/Item.js';
import verifyToken from '../../middlewares/verifyToken.js';
import imageUpload from '../../middlewares/multer.js';
import {uploadToCloudinary} from '../../middlewares/cloudinary.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables
const router = express.Router();
// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage
const storage = multer.memoryStorage();
const Upload = multer({ storage });



// Route for updating item photo
router.put(
  '/updateItemPhoto',
  verifyToken,
  imageUpload.single('img'),
  async (req, res) => {
    const { id, userId } = req.query;

    if (!req.file) {
      return res.status(400).json({ message: '❌ No image uploaded.' });
    }

    try {
      if (
        !mongoose.Types.ObjectId.isValid(id) ||
        !mongoose.Types.ObjectId.isValid(userId)
      ) {
        return res.status(400).json({ message: '❌ Invalid ID format.' });
      }

      // Upload image to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(req.file.path, 'items');
      if (!cloudinaryResult?.secure_url) {
        fs.unlinkSync(req.file.path); // Remove the file if upload fails
        return res
          .status(500)
          .json({ message: '❌ Failed to upload image to Cloudinary.' });
      }

      // Update the item with the new image URL
      const updatedItem = await Item.findByIdAndUpdate(
        id,
        { img: cloudinaryResult.secure_url },
        { new: true }
      );

      if (!updatedItem) {
        return res.status(404).json({ message: '❌ Item not found.' });
      }

      res.status(200).json({
        message: '✅ Item photo updated successfully.',
        data: updatedItem,
      });
    } catch (error) {
      console.error('Error updating item photo:', error);
      res
        .status(500)
        .json({ message: '❌ Internal server error', error: error.message });
    }
  }
);



export default router;
