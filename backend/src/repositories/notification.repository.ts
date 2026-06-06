// Import du modèle MongoDB des notifications.
// NotificationType est un type représentant les différentes
// catégories de notifications disponibles dans l'application.
import {
  NotificationModel,
  type NotificationType,
} from "../models/notification.model";

/**
 * Interface décrivant les données nécessaires
 * à la création d'une notification.
 */
interface CreateNotificationData {
  // Identifiant du destinataire de la notification
  userId: number;

  // Type de notification
  // Exemple : MESSAGE, GROUP_INVITATION, SYSTEM, etc.
  type: NotificationType;

  // Titre affiché à l'utilisateur
  title: string;

  // Contenu détaillé de la notification
  content: string;
}

/**
 * Repository responsable de la gestion des notifications.
 *
 * Ce repository centralise toutes les opérations
 * d'accès à la collection MongoDB des notifications.
 */
export const notificationRepository = {
  /**
   * Crée une nouvelle notification.
   *
   * Cette méthode est utilisée lorsqu'un événement
   * doit être signalé à un utilisateur :
   *
   * Exemples :
   * - nouveau message reçu
   * - invitation à rejoindre un groupe
   * - validation d'une demande
   * - notification système
   *
   * @param data Données de la notification
   * @returns La notification créée
   */
  create(data: CreateNotificationData) {
    return NotificationModel.create(data);
  },

  /**
   * Récupère toutes les notifications d'un utilisateur.
   *
   * Les notifications sont triées du plus récent
   * au plus ancien afin d'afficher les dernières
   * informations en priorité.
   *
   * L'utilisation de lean() améliore les performances
   * en retournant des objets JavaScript simples
   * plutôt que des documents Mongoose complets.
   *
   * @param userId Identifiant de l'utilisateur
   * @returns Liste des notifications
   */
  findByUserId(userId: number) {
    return (
      NotificationModel.find({
        userId,
      })

        // Tri décroissant :
        // notification la plus récente en premier
        .sort({ createdAt: -1 })

        // Optimisation des performances
        .lean()
    );
  },

  /**
   * Marque une notification comme lue.
   *
   * La requête vérifie simultanément :
   * - l'identifiant de la notification
   * - l'identifiant du propriétaire
   *
   * Cette double vérification empêche un utilisateur
   * de modifier une notification qui ne lui appartient pas.
   *
   * @param id Identifiant MongoDB de la notification
   * @param userId Identifiant du propriétaire
   * @returns La notification mise à jour
   */
  markAsRead(id: string, userId: number) {
    return NotificationModel.findOneAndUpdate(
      // Recherche sécurisée
      {
        _id: id,
        userId,
      },

      // Mise à jour du statut de lecture
      {
        isRead: true,
      },

      // Retourne le document après modification
      {
        returnDocument: "after",
      },
    );
  },
};
