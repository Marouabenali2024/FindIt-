import express from 'express';
import Item from '../../models/Item.js';
import User from '../../models/User.js'; // ✅ Corrected import

// 🟠 Update User Email
router.put('/updateEmail/:id', async (req, res) => {
  const { id } = req.params;
  const { newEmail } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { email: newEmail },
      { new: true }
    );
    res.status(200).json({ message: 'Email updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating email', error });
  }
});

export default router;
