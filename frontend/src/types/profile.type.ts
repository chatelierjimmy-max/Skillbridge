/**
 * ==========================================================
 * TYPES DU PROFIL UTILISATEUR
 * ==========================================================
 *
 * Ce fichier définit les structures utilisées pour gérer
 * les profils des utilisateurs dans SkillBridge.
 *
 * Le profil complète les informations d'authentification
 * (nom, prénom, email) avec des informations liées à
 * l'apprentissage et à la collaboration.
 *
 * Utilisé par :
 * - ProfilePage
 * - DashboardPage
 * - SearchPage
 * - profileService
 * - groupService
 */

/**
 * Niveaux d'expérience disponibles.
 *
 * BEGINNER :
 * Débutant dans la compétence concernée.
 *
 * INTERMEDIATE :
 * Niveau intermédiaire.
 *
 * ADVANCED :
 * Niveau avancé.
 */
export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

/**
 * Représentation du profil utilisateur.
 *
 * Chaque utilisateur possède un profil
 * associé à son compte principal.
 *
 * Ce profil contient des informations utiles
 * pour trouver des partenaires d'apprentissage
 * et rejoindre des groupes adaptés.
 */
export interface Profile {
  /**
   * Identifiant unique du profil.
   *
   * Généralement la clé primaire
   * de la table Profile.
   */
  id: number;

  /**
   * Identifiant de l'utilisateur propriétaire
   * du profil.
   *
   * Permet la liaison :
   * User ↔ Profile
   */
  userId: number;

  /**
   * Présentation libre de l'utilisateur.
   *
   * Exemple :
   * "Développeur React passionné
   * souhaitant progresser en Node.js."
   */
  bio?: string;

  /**
   * Niveau général déclaré.
   *
   * BEGINNER
   * INTERMEDIATE
   * ADVANCED
   */
  level?: Level;

  /**
   * Disponibilités de l'utilisateur.
   *
   * Exemple :
   * "Soirs et week-ends"
   * "Lundi au vendredi après 18h"
   */
  availability?: string;

  /**
   * Ville ou localisation.
   *
   * Exemple :
   * Paris
   * Lyon
   * Toulouse
   */
  location?: string;
}
