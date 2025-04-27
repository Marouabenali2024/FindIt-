import express from 'express';
import Item from '../../models/Item.js';
const router = express.Router();

// Get a Single Item by ID
router.get('/getItems', async (req, res) => {
  try {
    const { id } = req.params; // Get item ID from the URL parameter

    if (!id) {
      return res.status(400).json({ message: '❌ Item ID is required.' });
    }

    // Find the item by ID and populate the 'userId' field with the corresponding User data
    const item = await Item.find(id).populate('userId');

    if (!item) {
      return res.status(404).json({ message: '❌ Item not found.' });
    }

    return res.status(200).json({ status: true, data: item });
  } catch (error) {
    console.error('Error fetching item:', error);
    return res.status(500).json({ message: '❌ Internal server error' });
  }
});

export default router;



