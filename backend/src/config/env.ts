import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["DATABASE_URL", "MONGO_URI", "JWT_SECRET", "FRONTEND_URL"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

export const env = {
  port: process.env.PORT || "5000",
  databaseUrl: process.env.DATABASE_URL as string,
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  frontendUrl: process.env.FRONTEND_URL as string,
  nodeEnv: process.env.NODE_ENV || "development",
};
