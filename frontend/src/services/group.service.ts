// Importation de l'instance Axios configurée.
// Elle gère automatiquement :
// - l'URL du backend
// - l'ajout du JWT
// - la gestion des erreurs d'authentification
import { api } from "./api";

// Importation des types utilisés pour les groupes.
import type {
  CreateGroupData,
  GroupDetail,
  GroupListItem,
  MyGroup,
} from "../types/group.type";

/**
 * Service de gestion des groupes.
 *
 * Centralise tous les appels API liés :
 * - à la consultation des groupes
 * - à la création d'un groupe
 * - à l'adhésion à un groupe
 * - au départ d'un groupe
 */
export const groupService = {
  /**
   * Récupère la liste de tous les groupes disponibles.
   *
   * Route API :
   * GET /groups
   *
   * Retour :
   * GroupListItem[]
   */
  async getGroups() {
    const response = await api.get<GroupListItem[]>("/groups");

    return response.data;
  },

  /**
   * Récupère les groupes auxquels
   * l'utilisateur connecté appartient.
   *
   * Route API :
   * GET /groups/me
   *
   * Retour :
   * MyGroup[]
   */
  async getMyGroups() {
    const response = await api.get<MyGroup[]>("/groups/me");

    return response.data;
  },

  /**
   * Récupère les détails complets d'un groupe.
   *
   * Route API :
   * GET /groups/:id
   *
   * @param id Identifiant du groupe
   *
   * Retour :
   * GroupDetail
   */
  async getGroupById(id: number) {
    const response = await api.get<GroupDetail>(`/groups/${id}`);

    return response.data;
  },

  /**
   * Crée un nouveau groupe.
   *
   * Route API :
   * POST /groups
   *
   * @param data Informations du groupe :
   * - nom
   * - description
   * - niveau
   * - compétence associée
   */
  async createGroup(data: CreateGroupData) {
    const response = await api.post("/groups", data);

    return response.data;
  },

  /**
   * Permet à l'utilisateur connecté
   * de rejoindre un groupe.
   *
   * Route API :
   * POST /groups/:id/join
   *
   * @param id Identifiant du groupe
   */
  async joinGroup(id: number) {
    const response = await api.post(`/groups/${id}/join`);

    return response.data;
  },

  /**
   * Permet à l'utilisateur connecté
   * de quitter un groupe.
   *
   * Route API :
   * DELETE /groups/:id/leave
   *
   * @param id Identifiant du groupe
   */
  async leaveGroup(id: number) {
    const response = await api.delete(`/groups/${id}/leave`);

    return response.data;
  },
};
