import { api } from "./api";
import type { AppNotification } from "../types/notification.type";

export const notificationService = {
  async getMyNotifications() {
    const response = await api.get<AppNotification[]>("/notifications");
    return response.data;
  },

  async markAsRead(id: string) {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },
};
