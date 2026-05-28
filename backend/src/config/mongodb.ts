import mongoose from "mongoose";
import { env } from "./env";

export const connectMongoDB = async (): Promise<void> => {
  try {
    const mongoUri = env.mongoUri;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
