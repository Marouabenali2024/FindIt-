import express from 'express';
import Item from '../../models/Item.js';
import mongoose from 'mongoose';


// Get Own Items by userId
router.get('/getOwnItems', async (req, res) => {
  try {
    const { userId } = req.params;
    let objuserId = mongoose.Types.ObjectId(userId);

    const items = await Item.find({ userId: objuserId }).populate('userId'); // Find items by userId
    return res.status(200).json({ status: true, data: item });
  } catch (error) {
    console.error('Error fetching item:', error);
    return res.status(500).json({ message: '❌ Internal server error' });
  }
});
export default router;

