/**
 * ==========================================================
 * TYPES D'AUTHENTIFICATION
 * ==========================================================
 *
 * Ce fichier contient les types utilisés
 * pour représenter un utilisateur authentifié
 * dans l'application SkillBridge.
 *
 * Il est utilisé notamment par :
 * - authService
 * - useAuth
 * - LoginPage
 * - AppLayout
 * - PrivateRoute
 * - AdminRoute
 */

/**
 * Rôles disponibles dans l'application.
 *
 * USER :
 * Utilisateur standard.
 *
 * ADMIN :
 * Administrateur disposant
 * de privilèges supplémentaires.
 */
export type UserRole = "USER" | "ADMIN";

/**
 * Représentation de l'utilisateur connecté.
 *
 * Cet objet est généralement :
 * - renvoyé par l'API après connexion
 * - stocké dans le localStorage
 * - utilisé par le hook useAuth()
 */
export interface AuthUser {
  /**
   * Identifiant unique de l'utilisateur.
   *
   * Correspond à la clé primaire SQL.
   */
  id: number;

  /**
   * Prénom de l'utilisateur.
   */
  firstname: string;

  /**
   * Nom de famille de l'utilisateur.
   */
  lastname: string;

  /**
   * Adresse email utilisée
   * pour l'authentification.
   */
  email: string;

  /**
   * Rôle du compte.
   *
   * USER ou ADMIN.
   *
   * Utilisé notamment pour :
   * - protéger certaines routes
   * - afficher le menu d'administration
   * - contrôler les permissions
   */
  role: UserRole;
}
