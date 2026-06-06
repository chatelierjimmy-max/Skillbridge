// Importation de l'instance Axios configurée.
// Cette instance gère automatiquement :
// - l'URL du backend
// - l'ajout du token JWT
// - les erreurs d'authentification (401)
import { api } from "./api";

// Type représentant une notification de l'application
import type { AppNotification } from "../types/notification.type";

/**
 * Service de gestion des notifications.
 *
 * Ce service centralise tous les appels API liés :
 * - à la récupération des notifications
 * - à la lecture des notifications
 */
export const notificationService = {
  /**
   * Récupère toutes les notifications
   * de l'utilisateur connecté.
   *
   * Route API :
   * GET /notifications
   *
   * Retour :
   * AppNotification[]
   */
  async getMyNotifications() {
    // Appel API pour récupérer les notifications
    const response = await api.get<AppNotification[]>("/notifications");

    // Retourne directement les données
    return response.data;
  },

  /**
   * Marque une notification comme lue.
   *
   * Route API :
   * PATCH /notifications/:id/read
   *
   * @param id Identifiant MongoDB de la notification
   */
  async markAsRead(id: string) {
    // Mise à jour du statut de la notification
    const response = await api.patch(`/notifications/${id}/read`);

    return response.data;
  },
};
