/**
 * ==========================================================
 * TYPES DE RECHERCHE D'APPRENANTS
 * ==========================================================
 *
 * Ce fichier contient les structures utilisées pour la
 * fonctionnalité de recherche d'utilisateurs dans SkillBridge.
 *
 * Il permet :
 * - de représenter les résultats retournés par la recherche
 * - de définir les filtres envoyés au backend
 *
 * Utilisé par :
 * - SearchPage
 * - searchService
 * - API /users/search
 */

// Importation du type représentant le niveau utilisateur.
import type { Level } from "./profile.type";

// Importation du type représentant une compétence
// associée à un utilisateur.
import type { UserSkill } from "./skill.type";

/**
 * Représente un utilisateur trouvé
 * lors d'une recherche.
 *
 * Chaque résultat contient :
 * - les informations principales de l'utilisateur
 * - son profil
 * - ses compétences
 */
export interface LearnerResult {
  /**
   * Identifiant unique de l'utilisateur.
   */
  id: number;

  /**
   * Prénom.
   */
  firstname: string;

  /**
   * Nom de famille.
   */
  lastname: string;

  /**
   * Profil de l'utilisateur.
   *
   * Peut être null si le profil
   * n'a pas encore été créé.
   */
  profile: {
    /**
     * Présentation personnelle.
     */
    bio?: string;

    /**
     * Niveau général de l'utilisateur.
     */
    level?: Level;

    /**
     * Disponibilités déclarées.
     */
    availability?: string;

    /**
     * Ville ou localisation.
     */
    location?: string;
  } | null;

  /**
   * Liste des compétences possédées
   * par l'utilisateur.
   */
  skills: UserSkill[];
}

/**
 * Représente les filtres envoyés
 * lors d'une recherche d'apprenants.
 *
 * Tous les champs sont optionnels afin
 * de permettre des recherches partielles.
 */
export interface SearchFilters {
  /**
   * Texte libre pour rechercher un utilisateur.
   *
   * Exemple :
   * Nathan
   * Durand
   */
  q?: string;

  /**
   * Nom de la compétence recherchée.
   *
   * Exemple :
   * "React"
   * "Node.js"
   * "TypeScript"
   */
  skill?: string;

  /**
   * Niveau recherché.
   *
   * Peut également être une chaîne vide
   * lorsqu'aucun filtre n'est sélectionné.
   */
  level?: Level | "";

  /**
   * Ville recherchée.
   *
   * Exemple :
   * Paris
   * Lyon
   * Marseille
   */
  city?: string;
}
