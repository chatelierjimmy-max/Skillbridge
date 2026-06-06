// Import du type Level généré par Prisma.
// Il représente les niveaux de compétence autorisés :
// - BEGINNER
// - INTERMEDIATE
// - ADVANCED
import type { Level } from "@prisma/client";

// Repository responsable des recherches d'apprenants.
// Il construit les requêtes Prisma dynamiques
// en fonction des filtres reçus.
import { searchRepository } from "../repositories/search.repository";

/**
 * Filtres disponibles pour la recherche d'apprenants.
 */
export interface SearchLearnersInput {
  /**
   * Identifiant de l'utilisateur effectuant la recherche.
   *
   * Utilisé pour exclure l'utilisateur lui-même
   * des résultats retournés.
   */
  userId: number;

  /**
   * Nom de compétence recherché.
   *
   * Exemple :
   * - React
   * - TypeScript
   * - Docker
   */
  skill?: string;

  /**
   * Niveau recherché.
   */
  level?: Level;

  /**
   * Ville ou localisation recherchée.
   */
  city?: string;

  /**
   * Numéro de page pour la pagination.
   */
  page?: number;

  /**
   * Nombre maximal de résultats à retourner.
   */
  limit?: number;
}

/**
 * Service de recherche d'apprenants.
 *
 * Responsable de :
 * - transmettre les filtres au repository
 * - transformer les résultats
 * - exposer uniquement les données utiles
 */
export const searchService = {
  /**
   * Recherche des apprenants selon différents critères.
   *
   * Filtres possibles :
   * - compétence
   * - niveau
   * - ville
   * - pagination
   */
  async searchLearners(filters: SearchLearnersInput) {
    // Exécution de la recherche dans la base de données.
    const learners = await searchRepository.searchLearners(filters);

    /**
     * Transformation des résultats.
     *
     * L'objectif est de :
     * - simplifier la structure retournée
     * - masquer les détails techniques Prisma
     * - exposer uniquement les données utiles au frontend
     */
    return learners.map((learner) => ({
      id: learner.id,
      firstname: learner.firstname,
      lastname: learner.lastname,

      // Informations du profil utilisateur.
      profile: learner.profile,

      /**
       * Liste des compétences de l'utilisateur.
       *
       * Transformation de la relation :
       * User
       *   ↓
       * UserSkill
       *   ↓
       * Skill
       */
      skills: learner.skills.map((userSkill) => ({
        // Identifiant de la compétence.
        id: userSkill.skill.id,

        // Nom de la compétence.
        name: userSkill.skill.name,

        // Catégorie de la compétence.
        category: userSkill.skill.category,

        // Niveau de maîtrise de l'utilisateur.
        level: userSkill.level,
      })),
    }));
  },
};
