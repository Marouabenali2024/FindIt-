import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import imageUpload from '../../middlewares/multer.js';
import {uploadToCloudinary} from '../../middlewares/cloudinary.js';
import Item from '../../models/Item.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();
// ✅ Add Item Route (with image upload)
router.post('/addItem/:userId',verifyToken,imageUpload.single('img'), async (req, res) => {
    try {
      const { userId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: '❌ Invalid user ID format' });
      }

      const {
        title,
        description,
        category = 'Uncategorized',
        address,
        comments = '[]', // default value if comments are not passed
        isFound = false,
        isLost = true,
      } = req.body;

      if (!title?.trim()) {
        return res.status(400).json({ message: '❌ Title is required' });
      }
      if (!description?.trim()) {
        return res.status(400).json({ message: '❌ Description is required' });
      }
      if (!address?.trim()) {
        // Fixed from location to address
        return res.status(400).json({ message: '❌ Location is required' });
      }

      let imgUrl = null;
      if (req.file) {
        try {
          const cloudinaryResult = await uploadToCloudinary(
            req.file.path,
            'items'
          );
          if (!cloudinaryResult?.secure_url) {
            throw new Error('Cloudinary upload failed');
          }
          imgUrl = cloudinaryResult.secure_url;
        } catch (uploadError) {
          console.error('❌ Cloudinary upload error:', uploadError);
          return res.status(500).json({ message: '❌ Image upload failed' });
        }
      }

      // Ensure comments are parsed correctly
      let parsedComments = [];
      try {
        parsedComments = JSON.parse(comments);
        if (!Array.isArray(parsedComments)) {
          throw new Error('Comments must be an array');
        }
        parsedComments = parsedComments.map((comment) => ({
          Id: new mongoose.Types.ObjectId(comment.userId),
          comment: comment.comment?.trim(),
          createdAt: new Date(),
        }));
      } catch (err) {
        return res.status(400).json({
          message: '❌ Invalid comments format',
          details: err.message,
        });
      }

      const newItem = new Item({
        userId: new mongoose.Types.ObjectId(userId),
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        address: address.trim(),
        img: imgUrl,
        comments: parsedComments,
        isFound: isFound === 'true' || isFound === true,
        isLost: isLost === 'true' || isLost === true,
      });

      const savedItem = await newItem.save();

      // Ensure file deletion only if file exists
      if (req.file?.path && fs.existsSync(req.file.path)) {
        try {
          await fs.promises.unlink(req.file.path); // Use fs.promises for better error handling
        } catch (error) {
          console.error('❌ Error deleting temporary file:', error);
        }
      }

      return res.status(201).json({
        title: savedItem.title,
        description: savedItem.description,
        category: savedItem.category,
        address: savedItem.address,
        img: savedItem.img,
        comments: savedItem.comments,
        isFound: savedItem.isFound,
        isLost: savedItem.isLost,
      });
    } catch (error) {
      console.error('❌ Error adding item:', error);
      return res.status(500).json({
        success: false,
        message: '❌ Internal server error',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);


export default router;
