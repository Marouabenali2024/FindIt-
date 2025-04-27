import express from 'express';
import mongoose from 'mongoose';
import Item from '../../models/Item.js';
import User from '../../models/User.js'; // ✅ استورد User
import validateJWT from '../../middlewares/validateJWT.js';

const router = express.Router();

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
export default router;
