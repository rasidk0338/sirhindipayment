import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const rawMongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/sirhindi";

    const mongoUri = rawMongoUri.trim().replace(/^['"]|['"]$/g, "");

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
