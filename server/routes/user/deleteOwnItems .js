import express from 'express';
import Item from '../../models/Item.js';
import mongoose from 'mongoose';
import validateJWT from '../../middlewares/validateJWT.js';

const router = express.Router();

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


export default router;
