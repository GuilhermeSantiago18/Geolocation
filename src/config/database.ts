import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/ozmap",
    );
    console.log("Database connected");
  } catch (error) {
    console.error("Error to connect Database", error);
    process.exit(1);
  }
};
