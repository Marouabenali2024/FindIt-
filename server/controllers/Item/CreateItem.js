import Item from '../../models/Item.js';

const createItem = async (req, res) => {
  const { name, userId, description, location } = req.body;

  try {
    // Check if the user exists
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Create a new item
    const newItem = new Item({ name, userId, description, location });

    // Save item to the database
    await newItem.save();

    res
      .status(201)
      .json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Item creation failed', error: error.message });
  }
};

export default createItem;
