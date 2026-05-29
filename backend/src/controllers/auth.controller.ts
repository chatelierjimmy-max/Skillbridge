import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const context = {
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      };

      await authService.register(req.body, context);

      res.status(201).json({
        message: "Compte créé avec succès",
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const context = {
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      };

      const result = await authService.login(req.body, context);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.me(req.user.id);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
};
