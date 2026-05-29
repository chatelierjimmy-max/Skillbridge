import type { Request, Response, NextFunction } from "express";
import { adminService } from "../services/admin.service";

export const adminController = {
  async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await adminService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  async disableUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await adminService.disableUser(
        req.user.id,
        Number(req.params.id),
      );

      res.status(200).json({
        message: "Utilisateur désactivé",
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  async enableUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await adminService.enableUser(
        req.user.id,
        Number(req.params.id),
      );

      res.status(200).json({
        message: "Utilisateur réactivé",
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  async getActivityLogs(_req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await adminService.getActivityLogs();
      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  },

  async getSecurityLogs(_req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await adminService.getSecurityLogs();
      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  },
};
