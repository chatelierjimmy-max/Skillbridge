// Import des enums Prisma.
// UserRole permet de distinguer USER / ADMIN.
// UserStatus permet de gérer l'état du compte utilisateur.
import { UserRole, UserStatus } from "@prisma/client";

// Repository administrateur.
// Il contient les requêtes liées aux utilisateurs côté administration.
import { adminRepository } from "../repositories/admin.repository";

// Service de logs.
// Utilisé pour enregistrer les actions administrateur
// et les événements de sécurité.
import { logService } from "./log.service";

// Service de notifications.
// Permet d'avertir un utilisateur lorsqu'une action le concerne.
import { notificationService } from "./notification.service";

// Classe d'erreur personnalisée.
// Permet de retourner des erreurs HTTP contrôlées.
import { AppError } from "../utils/AppError";

/**
 * Service administrateur.
 *
 * Il contient la logique métier liée :
 * - à la consultation des utilisateurs
 * - à la désactivation d'un compte
 * - à la réactivation d'un compte
 * - à la consultation des logs
 */
export const adminService = {
  /**
   * Récupère la liste complète des utilisateurs.
   */
  async getUsers() {
    return adminRepository.findAllUsers();
  },

  /**
   * Désactive un utilisateur.
   *
   * Étapes :
   * 1. Vérifier que l'utilisateur existe
   * 2. Empêcher la désactivation d'un administrateur
   * 3. Vérifier que le compte n'est pas déjà désactivé
   * 4. Mettre à jour le statut
   * 5. Envoyer une notification
   * 6. Enregistrer des logs de sécurité et d'activité
   */
  async disableUser(adminId: number, userId: number) {
    // Recherche de l'utilisateur ciblé
    const user = await adminRepository.findUserById(userId);

    // Si aucun utilisateur n'existe avec cet id,
    // on retourne une erreur 404.
    if (!user) {
      throw new AppError("Utilisateur introuvable", 404);
    }

    // Protection importante :
    // un administrateur ne peut pas désactiver
    // un autre compte administrateur.
    if (user.role === UserRole.ADMIN) {
      throw new AppError("Impossible de désactiver un administrateur", 403);
    }

    // Évite de désactiver plusieurs fois
    // un compte déjà désactivé.
    if (user.status === UserStatus.DISABLED) {
      throw new AppError("Utilisateur déjà désactivé", 409);
    }

    // Mise à jour du statut utilisateur.
    const updatedUser = await adminRepository.updateUserStatus(
      userId,
      UserStatus.DISABLED,
    );

    // Notification envoyée à l'utilisateur concerné.
    await notificationService.createNotification({
      userId,
      type: "ACCOUNT_DISABLED",
      title: "Compte désactivé",
      content: "Votre compte a été désactivé par un administrateur.",
    });

    // Log de sécurité :
    // trace l'événement sensible lié au compte utilisateur.
    await logService.security(
      "ACCOUNT_DISABLED",
      {
        userId,
      },
      `Disabled by admin ${adminId}`,
    );

    // Log d'activité :
    // trace l'action réalisée par l'administrateur.
    await logService.activity(
      "DISABLE_USER",
      {
        userId: adminId,
      },
      "USER",
      userId,
    );

    // Retourne l'utilisateur après modification.
    return updatedUser;
  },

  /**
   * Réactive un utilisateur désactivé.
   *
   * Étapes :
   * 1. Vérifier que l'utilisateur existe
   * 2. Vérifier qu'il n'est pas déjà actif
   * 3. Mettre son statut à ACTIVE
   * 4. Enregistrer l'action dans les logs
   */
  async enableUser(adminId: number, userId: number) {
    // Recherche de l'utilisateur ciblé
    const user = await adminRepository.findUserById(userId);

    // Utilisateur inexistant
    if (!user) {
      throw new AppError("Utilisateur introuvable", 404);
    }

    // Évite une mise à jour inutile
    // si le compte est déjà actif.
    if (user.status === UserStatus.ACTIVE) {
      throw new AppError("Utilisateur déjà actif", 409);
    }

    // Réactivation du compte utilisateur.
    const updatedUser = await adminRepository.updateUserStatus(
      userId,
      UserStatus.ACTIVE,
    );

    // Enregistrement de l'action administrateur.
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

  /**
   * Récupère les journaux d'activité.
   */
  async getActivityLogs() {
    return logService.getActivityLogs();
  },

  /**
   * Récupère les journaux de sécurité.
   */
  async getSecurityLogs() {
    return logService.getSecurityLogs();
  },
};
