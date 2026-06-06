// Import du routeur Express.
// Il permet de regrouper les routes liées à l'administration.
import { Router } from "express";

// Import de l'enum UserRole générée par Prisma.
// Utilisée ici pour limiter l'accès aux administrateurs.
import { UserRole } from "@prisma/client";

// Import du contrôleur administrateur.
// Il contient la logique métier exécutée par chaque route.
import { adminController } from "../controllers/admin.controller";

// Middleware d'authentification.
// Vérifie que l'utilisateur est connecté et possède un token valide.
import { authMiddleware } from "../middlewares/auth.middleware";

// Middleware de gestion des rôles.
// Permet de vérifier qu'un utilisateur possède les droits requis.
import { roleMiddleware } from "../middlewares/role.middleware";

// Middleware de validation des données.
// Vérifie les paramètres ou le corps des requêtes.
import { validate } from "../middlewares/validate.middleware";

// Schéma de validation utilisé pour valider l'identifiant utilisateur
// présent dans les paramètres de l'URL.
import { adminUserIdParamSchema } from "../schemas/admin.schema";

// Création d'une instance de routeur Express.
const router = Router();

/**
 * ==========================
 * Middlewares globaux
 * ==========================
 */

/**
 * Toutes les routes de ce fichier nécessitent
 * une authentification préalable.
 *
 * Exemple :
 * Authorization: Bearer <token>
 */
router.use(authMiddleware);

/**
 * Toutes les routes nécessitent également
 * le rôle ADMIN.
 *
 * Un utilisateur standard recevra
 * une erreur d'autorisation.
 */
router.use(roleMiddleware(UserRole.ADMIN));

/**
 * ==========================
 * Gestion des utilisateurs
 * ==========================
 */

/**
 * GET /admin/users
 *
 * Récupère la liste de tous les utilisateurs.
 *
 * Accessible uniquement aux administrateurs.
 */
router.get("/users", adminController.getUsers);

/**
 * PATCH /admin/users/:id/disable
 *
 * Désactive un compte utilisateur.
 *
 * Étapes :
 * 1. Validation du paramètre :id
 * 2. Exécution du contrôleur
 */
router.patch(
  "/users/:id/disable",

  // Validation du paramètre d'URL
  validate(adminUserIdParamSchema),

  // Désactivation du compte
  adminController.disableUser,
);

/**
 * PATCH /admin/users/:id/enable
 *
 * Réactive un compte utilisateur précédemment désactivé.
 *
 * Étapes :
 * 1. Validation du paramètre :id
 * 2. Exécution du contrôleur
 */
router.patch(
  "/users/:id/enable",

  // Validation du paramètre d'URL
  validate(adminUserIdParamSchema),

  // Réactivation du compte
  adminController.enableUser,
);

/**
 * ==========================
 * Journaux d'activité
 * ==========================
 */

/**
 * GET /admin/logs/activity
 *
 * Récupère les journaux d'activité.
 *
 * Exemple :
 * - création de groupe
 * - inscription utilisateur
 * - modification de profil
 * - suppression de données
 */
router.get("/logs/activity", adminController.getActivityLogs);

/**
 * ==========================
 * Journaux de sécurité
 * ==========================
 */

/**
 * GET /admin/logs/security
 *
 * Récupère les journaux de sécurité.
 *
 * Exemple :
 * - échec de connexion
 * - tentative d'accès non autorisée
 * - changement de mot de passe
 * - activité suspecte
 */
router.get("/logs/security", adminController.getSecurityLogs);

/**
 * Export du routeur afin qu'il puisse être
 * enregistré dans l'application Express.
 */
export default router;
