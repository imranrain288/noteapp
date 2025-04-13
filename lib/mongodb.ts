import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || "mongodb+srv://md:zxcvbnm%4021@noteapp.o2whi.mongodb.net/";

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise();
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// For direct MongoDB client access if needed
export const getMongoClient = async () => {
  try {
    await connectDB();
    return mongoose.connection.getClient();
  } catch (error) {
    console.error('Error getting MongoDB client:', error);
    throw error;
  }
};