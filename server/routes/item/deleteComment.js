import express from 'express';
import mongoose from 'mongoose';
import Item from '../../models/Item.js';
import validateJWT from '../../middlewares/validateJWT.js';

const router = express.Router();

// ✅ Delete Comment Route
router.delete('/deleteComment', validateJWT, async (req, res) => {
  try {
    const { itemId, commentId } = req.body;
    const userId = req.user.id;


    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: '❌ Item not found' });

    const comment = item.comments.id(commentId);
    if (!comment)
      return res.status(404).json({ message: '❌ Comment not found' });

    if (String(comment.userId) !== String(userId)) {
      return res
        .status(403)
        .json({ message: '❌ Unauthorized to delete this comment' });
    }

    comment.remove();
    await item.save();
    res
      .status(200)
      .json({
        message: '✅ Comment deleted successfully',
        comments: item.comments,
      });
  } catch (err) {
    console.error('❌ Error deleting comment:', err);
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});



export default router;
