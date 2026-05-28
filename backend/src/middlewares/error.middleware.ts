import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;

  res.status(statusCode).json({
    error: error.message || "Erreur interne du serveur",
    ...(env.nodeEnv === "development" && {
      stack: error.stack,
    }),
  });
};
