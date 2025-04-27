import express from 'express';
import Admin from '../../models/Admin.js'; // Correct path to Admin model
import mongoose from 'mongoose';

const router = express.Router();

// Example route to add a sub-admin
router.put('/addSubAdmin/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: '❌ Invalid ID format' });
    }

    // Find admin by ID
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: '❌ Admin not found' });
    }

    // Check if the admin is already a sub-admin
    if (admin.isSubAdmin) {
      return res.status(400).json({ message: '❌ Already a sub-admin' });
    }

    // Set the admin as a sub-admin
    admin.isSubAdmin = true;
    await admin.save();

    return res
      .status(200)
      .json({ message: '✅ Sub-admin added successfully', data: admin });
  } catch (error) {
    console.error('Error adding sub-admin:', error);
    return res.status(500).json({ message: '❌ Internal server error' });
  }
});

export default router;
