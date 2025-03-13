import express from 'express';
import Item from '../../models/Item.js';
import User from '../../models/User.js'; // ✅ Corrected import
const router = express.Router();

// 🔵 Get All Items
router.get('/Items', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error });
  }
});
export default router;
