import rateLimit from "express-rate-limit";
import { env } from "../config/env";

const skipInTest = (): boolean => env.nodeEnv === "test";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: skipInTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Trop de requêtes, veuillez réessayer plus tard.",
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skip: skipInTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Trop de tentatives de connexion, veuillez réessayer plus tard.",
  },
});
