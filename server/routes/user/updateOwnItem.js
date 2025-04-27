import express from 'express';
import mongoose from 'mongoose';
import Item from '../../models/Item.js'; // Assuming you have the Item model
import verifyToken from '../../middlewares/verifyToken.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables
const router = express.Router();

// ✅ Update Item Route
// Get Own Items by userId
router.get('/getOwnItems/:id', verifyToken,async (req, res) => {
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
export default router;
