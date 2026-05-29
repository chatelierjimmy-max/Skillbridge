import type { Request, Response, NextFunction } from "express";
import { notificationService } from "../services/notification.service";

export const notificationController = {
  async getMyNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await notificationService.getMyNotifications(
        req.user.id,
      );

      res.status(200).json(notifications);
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.markAsRead(
        req.user.id,
        req.params.id as string,
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
