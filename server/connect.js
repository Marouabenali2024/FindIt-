import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors'; // Ensure this is imported properly

dotenv.config();

const URI = process.env.MONGO_URI;

export async function connect() {
  try {
    if (!URI) throw new Error('MongoDB URI is not defined');

    console.log(colors.blue('🔍 Connecting to MongoDB...'));

    // Remove deprecated options
    await mongoose.connect(URI);

    console.log(colors.green('✅ Connected to MongoDB'));
    return true; // ✅ Connection successful
  } catch (error) {
    console.error(colors.red('❌ MongoDB Connection Error:'), error.message);
    return false; // ❌ Connection failed
  }
}
