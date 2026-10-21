import mongoose from "mongoose";
import { AppError } from "../../utils/AppError.js";

const connectDB = async (): Promise<void> => {
  const uri = process.env.DB_CONN_URI;

  if (!uri) {
    throw new AppError("DB_CONN_URI is missing from environment variables", 500);
  }

  try {
    await mongoose.connect(uri);
    console.log("Database connection established");
  } catch (error) {
    console.error("Error while connecting to database:", error);
    throw error;
  }
};

export default connectDB;