import express from 'express';
import upload from '../../middlewares/multerConfig.js'; // Import the multer middleware (configured for Cloudinary)
import Item from '../models/Item.js'; // Item model
import User from '../models/User.js'; // User model

const router = express.Router();

// Add Item route with file upload handling
router.post('/user', upload.single('file'), async (req, res) => {
  try {
    const { title, img, description, category, location, userId } = req.body; // Destructure other fields from body

    // Validate input
    if (!title || !userId) {
      return res
        .status(400)
        .json({ message: 'Title and User ID are required.' });
    }

    // Log the userId to ensure it's being sent properly
    console.log('Received userId:', userId);

    // Validate the userId to be a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new item, including file information from 'req.file' (Cloudinary file URL)
    const newItem = new Item({
      title,
      img: req.file ? req.file.path : '', // Cloudinary URL is in req.file.path after upload
      description,
      category,
      location,
      userId,
    });

    // Save the new item to the database
    await newItem.save();

    // Return the newly added item
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    console.error('Error adding item:', error);
    res
      .status(500)
      .json({ message: 'Error adding item', error: error.message });
  }
});

export default router;
