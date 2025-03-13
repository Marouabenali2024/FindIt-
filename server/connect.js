import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URI = process.env.MONGO_URI;

async function connect() {
  try {
    if (!URI) {
      throw new Error('MongoDB URI is not defined');
    }
    await mongoose.connect(URI);
    console.log('Connected to db');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

export { connect };
