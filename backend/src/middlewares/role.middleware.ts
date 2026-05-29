import type { Request, Response, NextFunction } from "express";
import { UserStatus } from "@prisma/client";
import type { UserRole } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { userRepository } from "../repositories/user.repository";

export const roleMiddleware =
  (...roles: UserRole[]) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        next(new AppError("Accès interdit", 403));
        return;
      }

      const user = await userRepository.findById(req.user.id);

      if (
        !user ||
        user.status !== UserStatus.ACTIVE ||
        !roles.includes(user.role)
      ) {
        next(new AppError("Accès interdit", 403));
        return;
      }

      req.user.role = user.role;
      next();
    } catch (error) {
      next(error);
    }
  };
