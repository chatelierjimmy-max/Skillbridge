// Import du routeur Express.
// Permet de regrouper les routes liées à l'authentification.
import { Router } from "express";

// Import du contrôleur d'authentification.
// Il contient la logique métier associée aux routes.
import { authController } from "../controllers/auth.controller";

// Middleware de validation des données.
// Vérifie que les données reçues respectent les schémas définis.
import { validate } from "../middlewares/validate.middleware";

// Schémas de validation utilisés pour l'inscription
// et la connexion.
import { registerSchema, loginSchema } from "../schemas/auth.schema";

// Middleware d'authentification.
// Vérifie la présence et la validité du token JWT.
import { authMiddleware } from "../middlewares/auth.middleware";

// Middleware de limitation des requêtes.
// Protège les routes sensibles contre les attaques
// par force brute ou spam.
import { authRateLimiter } from "../middlewares/rateLimit.middleware";

// Création du routeur Express.
const router = Router();

/**
 * ====================================
 * Inscription utilisateur
 * ====================================
 */

/**
 * POST /auth/register
 *
 * Permet à un nouvel utilisateur
 * de créer un compte.
 *
 * Pipeline :
 * 1. Rate Limiting
 * 2. Validation des données
 * 3. Création du compte
 */
router.post(
  "/register",

  /**
   * Protection contre :
   * - les attaques automatisées
   * - le spam d'inscriptions
   */
  authRateLimiter,

  /**
   * Validation du corps de la requête.
   *
   * Vérifie généralement :
   * - firstname
   * - lastname
   * - email
   * - password
   */
  validate(registerSchema),

  /**
   * Contrôleur chargé de créer l'utilisateur.
   */
  authController.register,
);

/**
 * ====================================
 * Connexion utilisateur
 * ====================================
 */

/**
 * POST /auth/login
 *
 * Permet à un utilisateur existant
 * de s'authentifier.
 *
 * Pipeline :
 * 1. Rate Limiting
 * 2. Validation des données
 * 3. Vérification des identifiants
 * 4. Génération du JWT
 */
router.post(
  "/login",

  /**
   * Limitation du nombre de tentatives
   * de connexion.
   *
   * Protection contre :
   * - brute force
   * - credential stuffing
   */
  authRateLimiter,

  /**
   * Validation des informations
   * de connexion.
   */
  validate(loginSchema),

  /**
   * Contrôleur de connexion.
   */
  authController.login,
);

/**
 * ====================================
 * Profil utilisateur connecté
 * ====================================
 */

/**
 * GET /auth/me
 *
 * Retourne les informations
 * de l'utilisateur authentifié.
 *
 * Nécessite un JWT valide.
 */
router.get(
  "/me",

  /**
   * Vérifie le token JWT.
   *
   * Si le token est invalide ou absent :
   * → erreur 401 Unauthorized.
   */
  authMiddleware,

  /**
   * Retourne les informations
   * du compte connecté.
   */
  authController.me,
);

/**
 * Export du routeur afin qu'il puisse
 * être enregistré dans l'application Express.
 */
export default router;
