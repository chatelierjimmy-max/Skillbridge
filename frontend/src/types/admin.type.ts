/**
 * ==========================================================
 * TYPES D'ADMINISTRATION ET DE JOURNALISATION (LOGS)
 * ==========================================================
 *
 * Ce fichier contient tous les types TypeScript utilisés
 * dans les fonctionnalités d'administration de SkillBridge.
 *
 * Il permet de typer :
 * - les utilisateurs administrables
 * - les logs d'activité
 * - les logs de sécurité
 *
 * Ces types sont principalement utilisés par :
 * - AdminUsersPage
 * - AdminLogsPage
 * - adminService
 */

/**
 * Statuts possibles d'un utilisateur.
 *
 * ACTIVE :
 * L'utilisateur peut se connecter et utiliser la plateforme.
 *
 * DISABLED :
 * L'utilisateur a été désactivé par un administrateur.
 * Son accès à l'application est bloqué.
 */
export type UserStatus = "ACTIVE" | "DISABLED";

/**
 * Rôles disponibles dans l'application.
 *
 * USER :
 * Utilisateur classique.
 *
 * ADMIN :
 * Administrateur ayant accès
 * aux fonctionnalités d'administration.
 */
export type UserRole = "USER" | "ADMIN";

/**
 * Représentation d'un utilisateur
 * dans l'interface d'administration.
 *
 * Utilisé notamment dans :
 * AdminUsersPage
 */
export interface AdminUser {
  /**
   * Identifiant unique SQL de l'utilisateur.
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
   * Adresse email.
   */
  email: string;

  /**
   * Rôle du compte.
   *
   * USER ou ADMIN.
   */
  role: UserRole;

  /**
   * Statut du compte.
   *
   * ACTIVE ou DISABLED.
   */
  status: UserStatus;

  /**
   * Date de création du compte.
   *
   * Format ISO :
   * 2026-06-01T15:30:00.000Z
   */
  createdAt: string;

  /**
   * Profil associé à l'utilisateur.
   *
   * Optionnel car certains utilisateurs
   * peuvent ne pas avoir complété leur profil.
   */
  profile?: {
    /**
     * Niveau déclaré.
     *
     * BEGINNER
     * INTERMEDIATE
     * ADVANCED
     */
    level?: string;

    /**
     * Ville de résidence.
     */
    location?: string;
  };
}

/**
 * Représentation d'un log d'activité.
 *
 * Ces logs permettent de suivre
 * les actions effectuées sur la plateforme.
 *
 * Utilisé dans :
 * AdminLogsPage
 */
export interface ActivityLog {
  /**
   * Identifiant MongoDB du document.
   */
  _id: string;

  /**
   * Utilisateur ayant réalisé l'action.
   *
   * Peut être absent dans certains cas.
   */
  userId?: number;

  /**
   * Action réalisée.
   *
   * Exemples :
   * CREATE_GROUP
   * JOIN_GROUP
   * CREATE_SESSION
   * DELETE_MESSAGE
   */
  action: string;

  /**
   * Type d'entité concernée.
   *
   * Exemples :
   * GROUP
   * SESSION
   * MESSAGE
   * USER
   */
  targetType?: string;

  /**
   * Identifiant de la cible concernée.
   */
  targetId?: string | number;

  /**
   * Adresse IP utilisée lors de l'action.
   */
  ipAddress?: string;

  /**
   * Informations navigateur/appareil.
   *
   * Exemple :
   * Chrome 137 Windows 11
   */
  userAgent?: string;

  /**
   * Date de création du log.
   */
  createdAt: string;
}

/**
 * Représentation d'un log de sécurité.
 *
 * Ces logs enregistrent les événements
 * liés à l'authentification et à la sécurité.
 *
 * Utilisé dans :
 * AdminLogsPage
 */
export interface SecurityLog {
  /**
   * Identifiant MongoDB du log.
   */
  _id: string;

  /**
   * Utilisateur concerné.
   *
   * Peut être absent si l'utilisateur
   * n'a pas été identifié.
   */
  userId?: number;

  /**
   * Email utilisé lors de l'événement.
   *
   * Exemple :
   * tentative de connexion.
   */
  email?: string;

  /**
   * Type d'événement de sécurité.
   *
   * Exemples :
   * LOGIN_SUCCESS
   * LOGIN_FAILED
   * ACCOUNT_DISABLED
   * TOKEN_EXPIRED
   */
  event: string;

  /**
   * Cause ou raison associée.
   *
   * Exemple :
   * Wrong password
   * Too many attempts
   */
  reason?: string;

  /**
   * Adresse IP de l'événement.
   */
  ipAddress?: string;

  /**
   * Informations navigateur/appareil.
   */
  userAgent?: string;

  /**
   * Date de création du log.
   */
  createdAt: string;
}
