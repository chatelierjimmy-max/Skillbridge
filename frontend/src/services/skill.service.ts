// Importation de l'instance Axios configurée.
// Cette instance gère automatiquement :
// - l'URL de base de l'API
// - l'ajout du token JWT
// - la gestion des erreurs d'authentification
import { api } from "./api";

// Types représentant les compétences disponibles
// et les compétences possédées par l'utilisateur.
import type { Skill, UserSkill } from "../types/skill.type";

// Type représentant les niveaux de maîtrise.
import type { Level } from "../types/profile.type";

/**
 * Service de gestion des compétences.
 *
 * Ce service centralise toutes les opérations liées :
 * - à la récupération des compétences disponibles
 * - à la consultation des compétences de l'utilisateur
 * - à l'ajout d'une compétence
 * - à la suppression d'une compétence
 */
export const skillService = {
  /**
   * Récupère la liste complète des compétences
   * disponibles dans l'application.
   *
   * Route API :
   * GET /users/skills
   *
   * Retour :
   * Skill[]
   */
  async getAllSkills() {
    const response = await api.get<Skill[]>("/users/skills");

    return response.data;
  },

  /**
   * Récupère les compétences de
   * l'utilisateur connecté.
   *
   * Route API :
   * GET /users/me/skills
   *
   * Retour :
   * UserSkill[]
   */
  async getMySkills() {
    const response = await api.get<UserSkill[]>("/users/me/skills");

    return response.data;
  },

  /**
   * Ajoute une nouvelle compétence
   * au profil de l'utilisateur.
   *
   * Route API :
   * POST /users/me/skills
   *
   * @param skillId Identifiant de la compétence
   * @param level Niveau de maîtrise
   */
  async addMySkill(skillId: number, level: Level) {
    const response = await api.post("/users/me/skills", {
      skillId,
      level,
    });

    return response.data;
  },

  /**
   * Supprime une compétence
   * du profil utilisateur.
   *
   * Route API :
   * DELETE /users/me/skills/:skillId
   *
   * @param skillId Identifiant de la compétence
   */
  async removeMySkill(skillId: number) {
    const response = await api.delete(`/users/me/skills/${skillId}`);

    return response.data;
  },
};
