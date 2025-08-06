/**
 * MongoDB connection utility using Mongoose.
 * Call connectDB() at server startup.
 */
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/reminder-app';
    await mongoose.connect(mongoURI);
    console.log('[DB] MongoDB connected');
  } catch (error) {
    console.error('[DB] MongoDB connection error:', error);
    process.exit(1);
  }
};
