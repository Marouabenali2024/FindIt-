import express from 'express';
import Item from '../models/Item.js'; // Assuming you have an Item model

const router = express.Router();

// Filter Items
router.get('/filterItem', async (req, res) => {
  try {
    const { category, location, title, isFound, isLost } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (location) filter.location = location;
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (isFound !== undefined) filter.isFound = isFound === 'true';
    if (isLost !== undefined) filter.isLost = isLost === 'true';

    console.log('Received Query Params:', req.query);
    console.log('Applied Filter:', filter);

    // تأكد أن الفلتر يحتوي على القيم الصحيحة
    if (!Object.keys(filter).length) {
      console.log('No filter applied, check if data is missing or incorrect.');
    }

    const items = await Item.find(filter);
    console.log('Fetched Items:', items);

    res.status(200).json(items);
  } catch (error) {
    console.error('❌ Error:', error.message);
    res
      .status(500)
      .json({ message: '❌ Error fetching items', error: error.message });
  }
});


export default router;
