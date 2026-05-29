import { UserRole, UserStatus } from "@prisma/client";
import { adminRepository } from "../repositories/admin.repository";
import { logService } from "./log.service";
import { notificationService } from "./notification.service";
import { AppError } from "../utils/AppError";

export const adminService = {
  async getUsers() {
    return adminRepository.findAllUsers();
  },

  async disableUser(adminId: number, userId: number) {
    const user = await adminRepository.findUserById(userId);

    if (!user) {
      throw new AppError("Utilisateur introuvable", 404);
    }

    if (user.role === UserRole.ADMIN) {
      throw new AppError("Impossible de désactiver un administrateur", 403);
    }

    if (user.status === UserStatus.DISABLED) {
      throw new AppError("Utilisateur déjà désactivé", 409);
    }

    const updatedUser = await adminRepository.updateUserStatus(
      userId,
      UserStatus.DISABLED,
    );

    await notificationService.createNotification({
      userId,
      type: "ACCOUNT_DISABLED",
      title: "Compte désactivé",
      content: "Votre compte a été désactivé par un administrateur.",
    });

    await logService.security(
      "ACCOUNT_DISABLED",
      {
        userId,
      },
      `Disabled by admin ${adminId}`,
    );

    await logService.activity(
      "DISABLE_USER",
      {
        userId: adminId,
      },
      "USER",
      userId,
    );

    return updatedUser;
  },

  async enableUser(adminId: number, userId: number) {
    const user = await adminRepository.findUserById(userId);

    if (!user) {
      throw new AppError("Utilisateur introuvable", 404);
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new AppError("Utilisateur déjà actif", 409);
    }

    const updatedUser = await adminRepository.updateUserStatus(
      userId,
      UserStatus.ACTIVE,
    );

    await logService.activity(
      "ENABLE_USER",
      {
        userId: adminId,
      },
      "USER",
      userId,
    );

    return updatedUser;
  },

  async getActivityLogs() {
    return logService.getActivityLogs();
  },

  async getSecurityLogs() {
    return logService.getSecurityLogs();
  },
};
