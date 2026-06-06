// Importation du type représentant le niveau d'un utilisateur
// ou d'un groupe (BEGINNER, INTERMEDIATE, ADVANCED).
import type { Level } from "./profile.type";

// Importation du type représentant une compétence.
import type { Skill } from "./skill.type";

/**
 * ==========================================================
 * TYPES DES GROUPES D'APPRENTISSAGE
 * ==========================================================
 *
 * Ce fichier contient toutes les structures de données
 * utilisées pour gérer les groupes dans SkillBridge.
 *
 * Il est utilisé par :
 * - GroupsPage
 * - GroupDetailPage
 * - DashboardPage
 * - GroupSessionsPage
 * - GroupMessagesPage
 * - groupService
 */

/**
 * Rôles possibles à l'intérieur d'un groupe.
 *
 * OWNER :
 * Créateur et gestionnaire du groupe.
 *
 * MEMBER :
 * Membre classique du groupe.
 */
export type GroupRole = "OWNER" | "MEMBER";

/**
 * Représentation simplifiée d'un groupe.
 *
 * Utilisée principalement dans :
 * - la liste des groupes
 * - les résultats de recherche
 */
export interface GroupListItem {
  /**
   * Identifiant unique du groupe.
   */
  id: number;

  /**
   * Nom du groupe.
   */
  name: string;

  /**
   * Description du groupe.
   *
   * Optionnelle.
   */
  description?: string;

  /**
   * Niveau recommandé pour le groupe.
   *
   * Peut être absent si aucun niveau
   * n'est imposé.
   */
  level?: Level;

  /**
   * Compétence associée au groupe.
   *
   * Exemple :
   * React
   * TypeScript
   * Node.js
   */
  skill: Skill;

  /**
   * Informations du créateur du groupe.
   */
  owner: {
    id: number;
    firstname: string;
    lastname: string;
  };

  /**
   * Nombre total de membres.
   */
  membersCount: number;

  /**
   * Date de création.
   */
  createdAt: string;
}

/**
 * Représentation d'un membre du groupe.
 *
 * Utilisée dans les détails d'un groupe.
 */
export interface GroupMember {
  /**
   * Identifiant utilisateur.
   */
  id: number;

  /**
   * Prénom.
   */
  firstname: string;

  /**
   * Nom.
   */
  lastname: string;

  /**
   * Email.
   */
  email: string;

  /**
   * Rôle dans le groupe.
   *
   * OWNER ou MEMBER.
   */
  role: GroupRole;

  /**
   * Date d'entrée dans le groupe.
   */
  joinedAt: string;
}

/**
 * Représentation complète d'un groupe.
 *
 * Utilisée lorsqu'on consulte
 * la page détaillée d'un groupe.
 */
export interface GroupDetail {
  /**
   * Identifiant du groupe.
   */
  id: number;

  /**
   * Nom du groupe.
   */
  name: string;

  /**
   * Description détaillée.
   */
  description?: string;

  /**
   * Niveau recommandé.
   */
  level?: Level;

  /**
   * Compétence associée.
   */
  skill: Skill;

  /**
   * Créateur du groupe.
   */
  owner: {
    id: number;
    firstname: string;
    lastname: string;
  };

  /**
   * Liste complète des membres.
   */
  members: GroupMember[];

  /**
   * Date de création.
   */
  createdAt: string;
}

/**
 * Représentation d'un groupe
 * auquel appartient l'utilisateur connecté.
 *
 * Utilisée dans :
 * - DashboardPage
 * - getMyGroups()
 */
export interface MyGroup {
  /**
   * Identifiant du groupe.
   */
  id: number;

  /**
   * Nom du groupe.
   */
  name: string;

  /**
   * Description.
   */
  description?: string;

  /**
   * Niveau du groupe.
   */
  level?: Level;

  /**
   * Compétence associée.
   */
  skill: Skill;

  /**
   * Nombre de membres.
   */
  membersCount: number;

  /**
   * Rôle de l'utilisateur connecté
   * dans ce groupe.
   */
  role: GroupRole;
}

/**
 * Données nécessaires pour créer un groupe.
 *
 * Utilisée par :
 * groupService.createGroup()
 */
export interface CreateGroupData {
  /**
   * Nom du groupe.
   */
  name: string;

  /**
   * Description facultative.
   */
  description?: string;

  /**
   * Niveau ciblé.
   */
  level: Level;

  /**
   * Identifiant de la compétence
   * associée au groupe.
   */
  skillId: number;
}
