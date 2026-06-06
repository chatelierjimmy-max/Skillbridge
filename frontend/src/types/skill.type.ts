/**
 * ==========================================================
 * TYPES DES COMPÉTENCES
 * ==========================================================
 *
 * Ce fichier contient les structures utilisées pour gérer
 * les compétences dans SkillBridge.
 *
 * Les compétences constituent l'élément central de la
 * plateforme puisqu'elles permettent :
 * - la création de groupes
 * - la recherche d'apprenants
 * - la gestion du profil utilisateur
 * - l'organisation des sessions
 *
 * Utilisé par :
 * - ProfilePage
 * - SearchPage
 * - GroupsPage
 * - DashboardPage
 * - skillService
 */

// Importation du type représentant le niveau
// de maîtrise d'une compétence.
import type { Level } from "./profile.type";

/**
 * Représente une compétence disponible
 * dans l'application.
 *
 * Exemple :
 * React
 * TypeScript
 * Node.js
 * Docker
 */
export interface Skill {
  /**
   * Identifiant unique de la compétence.
   */
  id: number;

  /**
   * Nom de la compétence.
   */
  name: string;

  /**
   * Catégorie de la compétence.
   *
   * Facultative.
   *
   * Exemples :
   * Frontend
   * Backend
   * DevOps
   * Base de données
   */
  category?: string;
}

/**
 * Représente une compétence possédée
 * par un utilisateur.
 *
 * Cette interface hérite de Skill
 * et ajoute le niveau de maîtrise.
 */
export interface UserSkill extends Skill {
  /**
   * Niveau de maîtrise de la compétence.
   *
   * BEGINNER
   * INTERMEDIATE
   * ADVANCED
   */
  level: Level;
}
