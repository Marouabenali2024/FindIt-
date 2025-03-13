import express from 'express';
import Item from '../../models/Item.js';
import User from '../../models/User.js'; // ✅ Corrected import


// 🟡 Filter Items
router.get('/filterItem', async (req, res) => {
  const { cat, loc, title } = req.query;
  let filter = {};

  if (cat) filter.category = cat;
  if (loc) filter.location = loc;
  if (title) filter.title = { $regex: title, $options: 'i' };

  try {
    const filteredItems = await Item.find(filter);
    res.status(200).json(filteredItems);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering items', error });
  }
});
export default router;