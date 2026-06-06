// Importation de l'instance Axios configurée.
// Cette instance gère automatiquement :
// - l'URL du backend
// - l'ajout du token JWT
// - la gestion des erreurs d'authentification
import { api } from "./api";

// Importation du type représentant un profil utilisateur.
import type { Profile } from "../types/profile.type";

/**
 * Service de gestion du profil utilisateur.
 *
 * Ce service centralise toutes les opérations liées :
 * - à la consultation du profil
 * - à la modification du profil
 */
export const profileService = {
  /**
   * Récupère le profil de l'utilisateur connecté.
   *
   * Route API :
   * GET /users/me/profile
   *
   * Retour :
   * Profile
   */
  async getMyProfile() {
    // Appel API pour récupérer le profil
    const response = await api.get<Profile>("/users/me/profile");

    // Retourne directement les données du profil
    return response.data;
  },

  /**
   * Met à jour le profil de l'utilisateur connecté.
   *
   * Route API :
   * PUT /users/me/profile
   *
   * @param data Données du profil à modifier
   *
   * Partial<Profile> signifie que tous les champs
   * sont facultatifs lors de la mise à jour.
   */
  async updateMyProfile(data: Partial<Profile>) {
    // Envoi des nouvelles informations au backend
    const response = await api.put("/users/me/profile", data);

    return response.data;
  },
};
