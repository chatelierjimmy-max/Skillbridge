/**
 * Importation du type Level.
 *
 * Ce type définit les niveaux possibles
 * dans l'application :
 *
 * - BEGINNER
 * - INTERMEDIATE
 * - ADVANCED
 */
import type { Level } from "../types/profile.type";

/**
 * ==========================================================
 * TABLE DE CORRESPONDANCE DES NIVEAUX
 * ==========================================================
 *
 * Cette constante permet de convertir les valeurs
 * techniques stockées en base de données ou renvoyées
 * par l'API en libellés lisibles pour l'utilisateur.
 *
 * Exemple :
 *
 * "BEGINNER"
 *      ↓
 * "Débutant"
 *
 * Utilisée dans :
 * - ProfilePage
 * - SearchPage
 * - GroupsPage
 * - GroupDetailPage
 * - toute page affichant un niveau
 */
export const levelLabel: Record<Level, string> = {
  /**
   * Niveau débutant.
   */
  BEGINNER: "Débutant",

  /**
   * Niveau intermédiaire.
   */
  INTERMEDIATE: "Intermédiaire",

  /**
   * Niveau avancé.
   */
  ADVANCED: "Avancé",
};
