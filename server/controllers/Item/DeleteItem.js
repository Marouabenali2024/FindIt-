import Item from '../../models/Item.js';

const deleteItem = async (req, res) => {
  const { id } = req.params; // Get the item ID from the URL
  const { userId } = req.body; // Get the user ID from the request body (or req.user if using middleware)
  console.log('Request Params:', req.params); // Log the item ID
  console.log('Request Body:', req.body); // Log the request body
  try {
    // Check if the item exists and belongs to the user
    const item = await Item.findOne({ _id: id, userId });

    if (!item) {
      return res
        .status(404)
        .json({ message: 'Item not found or unauthorized' });
    }

    // Delete the item
    await Item.deleteOne({ _id: id });

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Item deletion failed', error: error.message });
  }
};

export default deleteItem;
