import express from 'express';
import Item from '../../models/Item.js';

const router = express.Router();

// Get a Single Item by ID
router.get('/getItem/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get item ID from the URL parameter

    // Find the item by ID and populate the 'userId' field with the corresponding User data
    const item = await Item.findById(id).populate("userId");

    return res.status(200).json({ status: true, data: item });
  } catch (error) {
    console.error('Error fetching item:', error);
    return res.status(500).json({ message: '❌ Internal server error' });
  }
});

export default router;
