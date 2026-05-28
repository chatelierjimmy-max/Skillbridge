import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const notFoundMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new AppError(`Route introuvable : ${req.originalUrl}`, 404));
};
