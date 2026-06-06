// Importation de l'instance Axios configurée.
// Cette instance gère automatiquement :
// - l'URL du backend
// - l'ajout du token JWT
// - la gestion des erreurs d'authentification
import { api } from "./api";

// Importation des types utilisés pour les sessions.
import type {
  CreateSessionData,
  GroupSession,
  MySession,
} from "../types/session.type";

/**
 * Service de gestion des sessions d'apprentissage.
 *
 * Ce service centralise tous les appels API liés :
 * - à la consultation des sessions
 * - à la création de sessions
 * - à l'inscription aux sessions
 * - à l'annulation d'inscription
 */
export const sessionService = {
  /**
   * Récupère toutes les sessions d'un groupe.
   *
   * Route API :
   * GET /groups/:groupId/sessions
   *
   * @param groupId Identifiant du groupe
   *
   * Retour :
   * GroupSession[]
   */
  async getGroupSessions(groupId: number) {
    const response = await api.get<GroupSession[]>(
      `/groups/${groupId}/sessions`,
    );

    return response.data;
  },

  /**
   * Crée une nouvelle session dans un groupe.
   *
   * Route API :
   * POST /groups/:groupId/sessions
   *
   * @param groupId Identifiant du groupe
   * @param data Informations de la session
   */
  async createSession(groupId: number, data: CreateSessionData) {
    const response = await api.post(`/groups/${groupId}/sessions`, data);

    return response.data;
  },

  /**
   * Inscrit l'utilisateur connecté à une session.
   *
   * Route API :
   * POST /sessions/:sessionId/book
   *
   * @param sessionId Identifiant de la session
   */
  async bookSession(sessionId: number) {
    const response = await api.post(`/sessions/${sessionId}/book`);

    return response.data;
  },

  /**
   * Annule l'inscription de l'utilisateur
   * à une session.
   *
   * Route API :
   * DELETE /sessions/:sessionId/book
   *
   * @param sessionId Identifiant de la session
   */
  async cancelBooking(sessionId: number) {
    const response = await api.delete(`/sessions/${sessionId}/book`);

    return response.data;
  },

  /**
   * Récupère toutes les sessions auxquelles
   * l'utilisateur connecté est inscrit.
   *
   * Route API :
   * GET /users/me/sessions
   *
   * Retour :
   * MySession[]
   */
  async getMySessions() {
    const response = await api.get<MySession[]>("/users/me/sessions");

    return response.data;
  },
};
