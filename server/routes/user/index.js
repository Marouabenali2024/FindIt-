import express from 'express';
import mongoose from 'mongoose';
import imageUpload from '../../middlewares/multer.js';
import uploadToCloudinary from '../../middlewares/cloudinary.js';
import { registerUser } from '../../routes/user/register.js';
import { loginUser } from '../../routes/user/Login.js';
import verifyAccount from '../../routes/user/verifyAccount.js';
import Item from '../../models/Item.js';
import Comment from '../../models/Comment.js';
import User from '../../models/User.js';
import moment from 'moment';
import verifyToken from '../../middlewares/verifyToken.js';
import validateJWT from '../../middlewares/validateJWT.js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config(); // 👈 لازم تكون هذي السطر قبل أي استعمال لـ process.env


const router = express.Router();

// Middleware to log token
const logToken = (req, res, next) => {
  let token = req.header('Authorization');
  console.log({ token });
  next();
};

router.get('/protected', validateJWT, (req, res) => {
  res.json({
    success: true,
    message: 'You accessed a protected route!',
    user: req.user,
  });
});
// ✅ User Authentication Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verifyAccount/:id', verifyAccount);

// ✅ Add Item Route (with image upload)
router.post('/addItem/:userId',verifyToken,imageUpload.single('img'),async (req, res) => {
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
          createdAt: new Date().toISOString(), // تأكد من استخدام ISO string
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



// ✅ Update Own Item Route
router.put('/updateOwnItem', verifyToken, async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.userId; // Extracted from token

    console.log('🛠️ Checking Item ID:', id);
    console.log('🔑 User ID (from token):', userId);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: '❌ Invalid item ID format' });
    }

    // Fetch item
    const item = await Item.findById(id);
    console.log('📦 Item found in DB:', item);

    if (!item) {
      return res.status(404).json({ message: '❌ Item not found in DB' });
    }

    console.log('👤 Item belongs to User ID:', item.userId.toString());

    if (item.userId.toString() !== userId) {
      console.log('⛔ Unauthorized: Item belongs to another user');
      return res
        .status(403)
        .json({ message: '⛔ Unauthorized: Not your item' });
    }

    // Proceed with update
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    console.log('✅ Successfully updated:', updatedItem);

    return res.status(200).json({
      message: '✅ Item updated successfully!',
      item: updatedItem,
    });
  } catch (error) {
    console.error('❌ Error updating item:', error);
    return res.status(500).json({ message: '❌ Internal server error' });
  }
});

// Route for updating item photo
router.put('/updateItemPhoto',verifyToken,imageUpload.single('img'), async (req, res) => {
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


// ✅  Get a Single Item 
router.get('/getItem/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get item ID from the URL parameter

    if (!id) {
      return res.status(400).json({ message: '❌ Item ID is required.' });
    }

    const item = await Item.findById(id).populate("userId"); // Populate ownerId

    if (!item) {
      return res.status(404).json({ message: '❌ Item not found.' });
    }

    return res.status(200).json({ status: true, data: item });
  } catch (error) {
    console.error('Error fetching item:', error);
    return res.status(500).json({ message: '❌ Internal server error' });
  }
});

// ✅  Get all Items
router.get('/getItems', async (req, res) => {
  try {
    const { id } = req.params; // Get item ID from the URL parameter

    // Find the item by ID and populate the 'userId' field with the corresponding User data
    const item = await Item.find().populate('userId');

    if (!item) {
      return res.status(404).json({ message: '❌ Item not found.' });
    }

    return res.status(200).json({ status: true, data: item });
  } catch (error) {
    console.error('Error fetching item:', error);
    return res.status(500).json({ message: '❌ Internal server error' });
  }
});
// Get Own Items by userId
router.get('/getOwnItems/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID before conversion
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: '❌ Invalid user ID format.' });
    }

    const objuserId = new mongoose.Types.ObjectId(id);

    // Find items by userId
    const items = await Item.find({ userId: objuserId });

    return res.status(200).json({ status: true, data: items });
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({ message: '❌ Internal server error' });
  }
});


// Delete Own Items by userId and item id
router.delete('/deleteOwnItems', validateJWT, async (req, res) => {
  try {
    const { id } = req.query;
    const { id: tokenUserId } = req.user; // Get userId from token

    const item = await Item.findOne({ _id: id, userId: tokenUserId });

    if (!item) {
      return res
        .status(404)
        .json({ message: '❌ Item not found or does not belong to you' });
    }

    await Item.deleteOne({ _id: id });
    return res.status(204).end(); // Successfully deleted
  } catch (error) {
    console.error('Error deleting item:', error.stack);
    return res
      .status(500)
      .json({ message: '❌ Internal server error', error: error.message });
  }
});



// Get User
router.get('/getUser/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from the URL parameter

    // Find the user by ID and select only the required fields
    const user = await User.findById(id, {
      fullName: 1,
      email: 1,
      address: 1,
      phone: 1,
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: '❌ User not found' });
    }

    return res.status(200).json({ status: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: '❌ Internal server error' });
  }
});

// Helper function to validate ObjectId format
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Add Comment Route
router.post('/addComment', validateJWT, async (req, res) => {
  try {
    const { comment, itemId } = req.body;
    const userId = req.user.id;

    if (!itemId || !comment.trim()) {
      return res.status(400).json({ message: '❌ itemId أو التعليق مفقود' });
    }

    if (
      !mongoose.Types.ObjectId.isValid(itemId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res
        .status(400)
        .json({ message: '❌ تنسيق itemId أو userId غير صالح' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: '❌ العنصر غير موجود' });
    }

    // الحصول على اسم المستخدم بناءً على الـ userId
    const user = await User.findById(userId);
    const userName = user ? user.fullName : 'Anonymous'; // اسم المستخدم، إذا لم يكن موجودًا يمكن استخدام اسم افتراضي

    // إضافة التعليق
    const newComment = {
      userId: userId,
      userName: userName, // إضافة اسم المستخدم هنا
      comment: comment.trim(),
    };

    // إضافة التعليق إلى العنصر
    item.comments.push(newComment);
    await item.save();

    // Retrieve the updated item and populate the userName of the comment
    const updatedItem = await Item.findById(itemId).populate({
      path: 'comments.userId',
      select: 'fullName',
    });

    // Return the updated comments with the user name and comment
    return res.status(201).json({
      message: '✅ تم إضافة التعليق بنجاح',
      comments: updatedItem.comments.map((c) => ({
        userName: c.userName || (c.userId?.fullName ?? 'Anonymous'),
        comment: c.comment,
        date: c.createdAt,
      })),
    });
  } catch (error) {
    console.error('❌ خطأ أثناء إضافة التعليق:', error);
    return res
      .status(500)
      .json({ message: '❌ خطأ في الخادم', error: error.message });
  }
});


// ✅ Delete Comment Route
router.delete('/deleteComment', validateJWT, async (req, res) => {
  try {
    const { itemId, commentId } = req.body;
    const userId = req.user.id;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: '❌ Item not found' });

    // Find the comment in the item.comments array
    const commentIndex = item.comments.findIndex((c) => c._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ message: '❌ Comment not found' });
    }

    const comment = item.comments[commentIndex];

    // Check if the userId matches the comment's userId
    if (comment.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: '❌ Unauthorized to delete this comment' });
    }

    // Remove the comment
    item.comments.splice(commentIndex, 1);
    await item.save();

    return res.status(200).json({
      message: '✅ تم حذف التعليق بنجاح',
      comments: item.comments,
    });
  } catch (err) {
    console.error('❌ خطأ أثناء حذف التعليق:', err);
    return res.status(500).json({ message: '❌ خطأ في الخادم', error: err.message });
  }
});


// ✅ Send Message Route
router.post('/sendMessage', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ message: '❌ Message content is required' });
    }

    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ message: '❌ Invalid senderId or receiverId' });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: '❌ Sender or receiver not found' });
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content: content.trim(),
    });

    await message.save();

    return res.status(200).json({
      message: '✅ Message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    return res.status(500).json({
      message: '❌ Server error',
      error: error.message,
    });
  }
});

// Filter Items 
router.get('/filterItem', async (req, res) => {
  try {
    const { category, location, title, isFound, isLost } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (location) filter.location = location;
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (isFound !== undefined) filter.isFound = isFound === 'true';
    if (isLost !== undefined) filter.isLost = isLost === 'true';

    console.log('Received Query Params:', req.query);
    console.log('Applied Filter:', filter);

    // تأكد أن الفلتر يحتوي على القيم الصحيحة
    if (!Object.keys(filter).length) {
      console.log('No filter applied, check if data is missing or incorrect.');
    }

    const items = await Item.find(filter);
    console.log('Fetched Items:', items);

    res.status(200).json(items);
  } catch (error) {
    console.error('❌ Error:', error.message);
    res
      .status(500)
      .json({ message: '❌ Error fetching items', error: error.message });
  }
});



// Update user information (email, password)

router.put('/updateInformations/:id', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { id } = req.params;

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    // Update email if provided
    if (email) {
      user.email = email;
    }

    // Hash the password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10); // Generates salt
      const hashedPassword = await bcrypt.hash(password, salt); // Hashes password
      user.password = hashedPassword;
    }

    // Save updated user
    await user.save();

    return res.status(200).json({
      message: '✅ User information updated successfully',
      user,
    });
  } catch (error) {
    console.error('❌ Error updating user:', error); // Debugging log
    return res.status(500).json({
      message: '❌ Error updating user information',
      error: error.message,
    });
  }
});




export default router;
