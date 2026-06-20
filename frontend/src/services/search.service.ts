// Importation de l'instance Axios configurée.
// Cette instance gère automatiquement :
// - l'URL du backend
// - l'ajout du JWT dans les requêtes
// - la gestion des erreurs 401
import { api } from "./api";

// Importation des types utilisés pour la recherche.
import type { LearnerResult, SearchFilters } from "../types/search.type";

/**
 * Service de recherche d'apprenants.
 *
 * Ce service centralise les appels API permettant
 * de rechercher des utilisateurs selon plusieurs critères :
 * - compétence
 * - niveau
 * - ville
 */
export const searchService = {
  /**
   * Recherche des apprenants correspondant aux filtres.
   *
   * Route API :
   * GET /users/search
   *
   * @param filters Critères de recherche
   *
   * Retour :
   * LearnerResult[]
   */
  async searchLearners(filters: SearchFilters) {
    // Envoi d'une requête GET avec paramètres d'URL.
    const response = await api.get<LearnerResult[]>("/users/search", {
      params: {
        q: filters.q || undefined,

        /**
         * Si aucun filtre n'est renseigné,
         * undefined évite d'envoyer un paramètre vide.
         *
         * Exemple :
         * skill=""
         *
         * devient :
         * skill=undefined
         *
         * Axios n'enverra alors pas ce paramètre.
         */
        skill: filters.skill || undefined,

        /**
         * Niveau recherché :
         * BEGINNER
         * INTERMEDIATE
         * ADVANCED
         */
        level: filters.level || undefined,

        /**
         * Ville recherchée.
         */
        city: filters.city || undefined,
      },
    });

    // Retour de la liste des apprenants trouvés
    return response.data;
  },
};
