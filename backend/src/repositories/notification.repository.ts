import {
  NotificationModel,
  type NotificationType,
} from "../models/notification.model";

interface CreateNotificationData {
  userId: number;
  type: NotificationType;
  title: string;
  content: string;
}

export const notificationRepository = {
  create(data: CreateNotificationData) {
    return NotificationModel.create(data);
  },

  findByUserId(userId: number) {
    return NotificationModel.find({ userId }).sort({ createdAt: -1 }).lean();
  },

  markAsRead(id: string, userId: number) {
    return NotificationModel.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { returnDocument: "after" },
    );
  },
};
