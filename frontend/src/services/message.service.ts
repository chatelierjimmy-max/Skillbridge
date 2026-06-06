// Importation de l'instance Axios configurée.
// Cette instance gère automatiquement :
// - l'URL du backend
// - l'ajout du token JWT
// - la gestion des erreurs 401
import { api } from "./api";

// Importation des types TypeScript utilisés
// pour typer les messages et les données envoyées.
import type { CreateMessageData, GroupMessage } from "../types/message.type";

/**
 * Service de gestion de la messagerie des groupes.
 *
 * Ce service centralise tous les appels API liés :
 * - à la récupération des messages
 * - à l'envoi d'un message
 * - à la suppression d'un message
 */
export const messageService = {
  /**
   * Récupère tous les messages d'un groupe.
   *
   * Route API :
   * GET /groups/:groupId/messages
   *
   * @param groupId Identifiant du groupe
   *
   * Retour :
   * GroupMessage[]
   */
  async getGroupMessages(groupId: number) {
    // Appel API pour récupérer les messages
    const response = await api.get<GroupMessage[]>(
      `/groups/${groupId}/messages`,
    );

    // Retourne la liste des messages
    return response.data;
  },

  /**
   * Envoie un nouveau message dans un groupe.
   *
   * Route API :
   * POST /groups/:groupId/messages
   *
   * @param groupId Identifiant du groupe
   * @param data Contenu du message
   */
  async createMessage(groupId: number, data: CreateMessageData) {
    // Envoi du message au backend
    const response = await api.post(`/groups/${groupId}/messages`, data);

    return response.data;
  },

  /**
   * Supprime un message existant.
   *
   * Route API :
   * DELETE /messages/:messageId
   *
   * @param messageId Identifiant MongoDB du message
   */
  async deleteMessage(messageId: string) {
    // Demande de suppression du message
    const response = await api.delete(`/messages/${messageId}`);

    return response.data;
  },
};
