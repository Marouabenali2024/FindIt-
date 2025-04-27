import express from 'express';
import mongoose from 'mongoose';
import checkAuth from '../../middlewares/authMiddleware/checkAuth.js';
import verifyAdmin from '../../middlewares/verifyAdmin.js'; // Added verifyAdmin
import Item from '../../models/Item.js';

const router = express.Router();

// Admin Delete Item using URL params
router.delete('/deleteItem/:id', checkAuth, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query; // Ensure that userId comes from query params

    // Check if the userId is provided
    if (!userId) {
      return res
        .status(400)
        .json({ message: '❌ Missing user ID in query parameters.' });
    }

    // Ensure that the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: '❌ Invalid item ID format.' });
    }

    // Find the item to be deleted
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: '❌ Item not found.' });
    }

    // Check if the item belongs to the user or if the user is an admin
if (comment.userId.toString() !== req.user.id) {
    return res.status(403).json({
      message: '❌ You do not have permission to delete this item.',
    });
  }


    // Delete the item
    await Item.findByIdAndDelete(id);

    // Log the action (useful for auditing)
    console.log(`Item with ID: ${id} deleted by user: ${userId}`);

    return res.status(200).json({ message: '✅ Item deleted successfully.' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: '❌ Internal server error.', error: error.message });
  }
});

export default router;
