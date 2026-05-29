import { Types } from "mongoose";
import { notificationRepository } from "../repositories/notification.repository";
import type { NotificationType } from "../models/notification.model";
import { AppError } from "../utils/AppError";

interface CreateNotificationInput {
  userId: number;
  type: NotificationType;
  title: string;
  content: string;
}

export const notificationService = {
  async createNotification(data: CreateNotificationInput) {
    return notificationRepository.create(data);
  },

  async getMyNotifications(userId: number) {
    return notificationRepository.findByUserId(userId);
  },

  async markAsRead(userId: number, notificationId: string) {
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new AppError("Identifiant de notification invalide", 400);
    }

    const notification = await notificationRepository.markAsRead(
      notificationId,
      userId,
    );

    if (!notification) {
      throw new AppError("Notification introuvable", 404);
    }

    return {
      message: "Notification marquée comme lue",
    };
  },
};
