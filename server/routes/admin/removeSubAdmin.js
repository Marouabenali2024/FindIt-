import express from 'express';
import Admin from '../../models/Admin.js';  // Correct path to Admin model
import mongoose from 'mongoose';

const router = express.Router();

// Example route to remove a sub-admin
router.delete('/removeSubAdmin/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: '❌ Invalid ID format' });
    }

    // Remove sub-admin by ID
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: '❌ Admin not found' });
    }

    // Check if the admin is a sub-admin
    if (!admin.isSubAdmin) {
      return res.status(400).json({ message: '❌ Not a sub-admin' });
    }

    // Remove sub-admin status
    admin.isSubAdmin = false;
    await admin.save();

    return res
      .status(200)
      .json({ message: '✅ Sub-admin removed successfully', data: admin });
  } catch (error) {
    console.error('Error removing sub-admin:', error);
    return res.status(500).json({ message: '❌ Internal server error' });
  }
});

export default router;
