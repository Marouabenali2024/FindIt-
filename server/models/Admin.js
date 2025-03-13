import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isMainAdmin: {
      type: Boolean,
      default: false,
    },
    isSubAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
