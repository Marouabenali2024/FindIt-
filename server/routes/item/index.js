import express from 'express';
import Item from '../../models/Item.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';
import validateJWT from '../../middlewares/validateJWT.js';
import moment from 'moment';

const router = express.Router();


// ✅ Add Comment Route
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
router.post('/deleteComment', async (req, res) => {
  try {
    const { itemId, commentId } = req.body;

    // Validate itemId and commentId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: '❌ Invalid itemId' });
    }
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: '❌ Invalid commentId' });
    }

    // Find the item by itemId
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: '❌ Item not found' });
    }

    // Check if the comment exists
    const commentExists = item.comments.some(
      (comment) => comment._id.toString() === commentId
    );
    if (!commentExists) {
      return res.status(404).json({ message: '❌ Comment not found' });
    }

    // Remove the comment from the comments array
    item.comments = item.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await item.save();

    // Send success response
    res.status(200).json({
      message: '✅ Comment deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting comment:', error);
    res.status(500).json({
      message: '❌ Something went wrong!',
      error: error.message,
    });
  }
});
// Route to fetch the latest three items (lost and found)
router.get('/api/items/latest', async (req, res) => {
  try {
    const latestItems = await Item.find()
      .sort({ createdAt: -1 })  // Sort by creation date, descending
      .limit(3);                // Limit to 3 items

    res.json(latestItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching latest items', error: err.message });
  }
})

export default router;
