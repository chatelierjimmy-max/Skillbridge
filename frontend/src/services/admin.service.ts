import { api } from "./api";
import type { ActivityLog, AdminUser, SecurityLog } from "../types/admin.type";

export const adminService = {
  async getUsers() {
    const response = await api.get<AdminUser[]>("/admin/users");
    return response.data;
  },

  async disableUser(id: number) {
    const response = await api.patch(`/admin/users/${id}/disable`);
    return response.data;
  },

  async enableUser(id: number) {
    const response = await api.patch(`/admin/users/${id}/enable`);
    return response.data;
  },

  async getActivityLogs() {
    const response = await api.get<ActivityLog[]>("/admin/logs/activity");
    return response.data;
  },

  async getSecurityLogs() {
    const response = await api.get<SecurityLog[]>("/admin/logs/security");
    return response.data;
  },
};
