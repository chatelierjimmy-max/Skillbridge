// Importation de l'instance Axios configurée de l'application.
// Cette instance contient généralement :
// - l'URL de base de l'API
// - les interceptors
// - le token JWT dans les headers
import { api } from "./api";

// Importation des types TypeScript utilisés
// pour typer les réponses de l'API d'administration.
import type { ActivityLog, AdminUser, SecurityLog } from "../types/admin.type";

/**
 * Service regroupant toutes les opérations
 * d'administration de SkillBridge.
 *
 * Ce service centralise les appels API liés :
 * - aux utilisateurs
 * - aux logs d'activité
 * - aux logs de sécurité
 */
export const adminService = {
  /**
   * Récupère la liste complète des utilisateurs.
   *
   * Route API :
   * GET /admin/users
   *
   * Retour :
   * AdminUser[]
   */
  async getUsers() {
    // Appel API
    const response = await api.get<AdminUser[]>("/admin/users");

    // Retourne directement les données
    return response.data;
  },

  /**
   * Désactive un utilisateur.
   *
   * Route API :
   * PATCH /admin/users/:id/disable
   *
   * @param id Identifiant de l'utilisateur
   */
  async disableUser(id: number) {
    // Appel API de désactivation
    const response = await api.patch(`/admin/users/${id}/disable`);

    return response.data;
  },

  /**
   * Réactive un utilisateur précédemment désactivé.
   *
   * Route API :
   * PATCH /admin/users/:id/enable
   *
   * @param id Identifiant de l'utilisateur
   */
  async enableUser(id: number) {
    // Appel API de réactivation
    const response = await api.patch(`/admin/users/${id}/enable`);

    return response.data;
  },

  /**
   * Récupère les logs d'activité.
   *
   * Ces logs permettent généralement de suivre :
   * - les créations
   * - les modifications
   * - les suppressions
   * - les actions importantes des utilisateurs
   *
   * Route API :
   * GET /admin/logs/activity
   *
   * Retour :
   * ActivityLog[]
   */
  async getActivityLogs() {
    const response = await api.get<ActivityLog[]>("/admin/logs/activity");

    return response.data;
  },

  /**
   * Récupère les logs de sécurité.
   *
   * Ces logs permettent généralement de suivre :
   * - les connexions
   * - les tentatives échouées
   * - les actions suspectes
   * - les incidents de sécurité
   *
   * Route API :
   * GET /admin/logs/security
   *
   * Retour :
   * SecurityLog[]
   */
  async getSecurityLogs() {
    const response = await api.get<SecurityLog[]>("/admin/logs/security");

    return response.data;
  },
};
