// Import de Types depuis Mongoose.
// Utilisé pour valider le format des ObjectId MongoDB.
import { Types } from "mongoose";

// Repository des notifications.
// Responsable des opérations CRUD sur les notifications.
import { notificationRepository } from "../repositories/notification.repository";

// Type représentant les catégories de notifications.
//
// Exemples :
// - GROUP_JOINED
// - ACCOUNT_DISABLED
// - SESSION_BOOKED
import type { NotificationType } from "../models/notification.model";

// Classe d'erreur personnalisée.
// Permet de générer des erreurs HTTP métier.
import { AppError } from "../utils/AppError";

/**
 * Données nécessaires à la création d'une notification.
 */
interface CreateNotificationInput {
  /**
   * Utilisateur destinataire.
   */
  userId: number;

  /**
   * Type de notification.
   */
  type: NotificationType;

  /**
   * Titre affiché dans la notification.
   */
  title: string;

  /**
   * Contenu détaillé de la notification.
   */
  content: string;
}

/**
 * Service métier des notifications.
 *
 * Responsable de :
 * - créer une notification
 * - récupérer les notifications d'un utilisateur
 * - marquer une notification comme lue
 */
export const notificationService = {
  /**
   * Crée une nouvelle notification.
   *
   * Cette méthode est généralement appelée
   * par d'autres services métier :
   * - groupService
   * - adminService
   * - sessionService
   * etc.
   */
  async createNotification(data: CreateNotificationInput) {
    return notificationRepository.create(data);
  },

  /**
   * Retourne toutes les notifications
   * de l'utilisateur connecté.
   *
   * Les notifications sont généralement
   * triées de la plus récente à la plus ancienne.
   */
  async getMyNotifications(userId: number) {
    return notificationRepository.findByUserId(userId);
  },

  /**
   * Marque une notification comme lue.
   *
   * Étapes :
   * 1. Vérifier le format de l'identifiant MongoDB
   * 2. Vérifier que la notification appartient à l'utilisateur
   * 3. Mettre à jour le statut de lecture
   */
  async markAsRead(userId: number, notificationId: string) {
    /**
     * Validation du format ObjectId.
     *
     * Exemple valide :
     * 665f8c2a7b6f3a21f0b12e89
     */
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new AppError("Identifiant de notification invalide", 400);
    }

    /**
     * Mise à jour de la notification.
     *
     * Le repository vérifie également
     * que la notification appartient bien
     * à l'utilisateur connecté.
     */
    const notification = await notificationRepository.markAsRead(
      notificationId,
      userId,
    );

    /**
     * Cas où :
     * - la notification n'existe pas
     * - elle appartient à un autre utilisateur
     */
    if (!notification) {
      throw new AppError("Notification introuvable", 404);
    }

    return {
      message: "Notification marquée comme lue",
    };
  },
};
