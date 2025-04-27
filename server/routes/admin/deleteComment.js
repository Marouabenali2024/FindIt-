import express from 'express';
import Comment from '../../models/Comment.js'; // Assuming you have a Comment model

const router = express.Router();

// Delete comment route
router.delete('/deleteComment/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the comment by ID
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    return res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ message: '❌ Internal server error' });
  }
});

export default router;
