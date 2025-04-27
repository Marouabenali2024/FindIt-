import express from 'express';
const router = express.Router();

// Example route to update user info
router.put('/updateInfo/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    // Update user information logic
    // Assume you have a User model to update
    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res
      .status(200)
      .json({ message: 'User info updated successfully', data: user });
  } catch (error) {
    console.error('Error updating user info:', error);
    return res.status(500).json({ message: '❌ Internal server error' });
  }
});

export default router;
