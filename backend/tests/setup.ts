import dotenv from "dotenv";
import mongoose from "mongoose";
import { prisma } from "../src/config/prisma";

dotenv.config();

beforeAll(async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await prisma.$disconnect();
  await mongoose.disconnect();
});
