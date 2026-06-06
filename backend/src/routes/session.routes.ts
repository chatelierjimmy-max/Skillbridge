// Import du routeur Express.
// Il permet de regrouper toutes les routes liées aux sessions d'apprentissage.
import { Router } from "express";

// Import du contrôleur des sessions.
// Il contient la logique métier associée aux sessions
// et aux réservations.
import { sessionController } from "../controllers/session.controller";

// Middleware d'authentification.
// Vérifie la présence et la validité du JWT.
import { authMiddleware } from "../middlewares/auth.middleware";

// Middleware de validation des données.
import { validate } from "../middlewares/validate.middleware";

// Schémas de validation utilisés par les routes des sessions.
import {
  // Validation des données de création d'une session
  createSessionSchema,

  // Validation du paramètre :groupId
  groupIdParamSchema,

  // Validation du paramètre :id d'une session
  sessionIdParamSchema,
} from "../schemas/session.schema";

// Création du routeur Express.
const router = Router();

/**
 * ====================================
 * Consultation des sessions d'un groupe
 * ====================================
 */

/**
 * GET /groups/:groupId/sessions
 *
 * Retourne toutes les sessions associées
 * à un groupe spécifique.
 *
 * Exemple :
 * GET /groups/5/sessions
 */
router.get(
  "/groups/:groupId/sessions",

  // Vérification du JWT
  authMiddleware,

  // Validation du groupId
  validate(groupIdParamSchema),

  // Récupération des sessions du groupe
  sessionController.getGroupSessions,
);

/**
 * ====================================
 * Création d'une session
 * ====================================
 */

/**
 * POST /groups/:groupId/sessions
 *
 * Permet de créer une nouvelle session
 * dans un groupe.
 *
 * Exemple :
 *
 * {
 *   "title": "Atelier React",
 *   "description": "Découverte des Hooks",
 *   "startDate": "2025-06-20T18:00:00Z",
 *   "duration": 120,
 *   "maxParticipants": 10
 * }
 */
router.post(
  "/groups/:groupId/sessions",

  // Utilisateur connecté obligatoire
  authMiddleware,

  // Validation du corps de la requête
  validate(createSessionSchema),

  // Création de la session
  sessionController.createSession,
);

/**
 * ====================================
 * Réservation d'une session
 * ====================================
 */

/**
 * POST /sessions/:id/book
 *
 * Inscrit l'utilisateur connecté
 * à une session.
 *
 * Exemple :
 * POST /sessions/12/book
 */
router.post(
  "/sessions/:id/book",

  // Vérification du JWT
  authMiddleware,

  // Validation de l'identifiant de session
  validate(sessionIdParamSchema),

  // Création de la réservation
  sessionController.bookSession,
);

/**
 * ====================================
 * Annulation d'une réservation
 * ====================================
 */

/**
 * DELETE /sessions/:id/book
 *
 * Annule la réservation de l'utilisateur
 * pour une session.
 *
 * La réservation n'est généralement pas supprimée,
 * mais son statut passe à CANCELLED.
 *
 * Exemple :
 * DELETE /sessions/12/book
 */
router.delete(
  "/sessions/:id/book",

  // Authentification obligatoire
  authMiddleware,

  // Validation de l'identifiant de session
  validate(sessionIdParamSchema),

  // Annulation de la réservation
  sessionController.cancelBooking,
);

/**
 * ====================================
 * Sessions de l'utilisateur connecté
 * ====================================
 */

/**
 * GET /users/me/sessions
 *
 * Retourne toutes les sessions auxquelles
 * l'utilisateur est actuellement inscrit.
 *
 * Exemple :
 * GET /users/me/sessions
 */
router.get(
  "/users/me/sessions",

  // Vérification du JWT
  authMiddleware,

  // Récupération des sessions de l'utilisateur
  sessionController.getMySessions,
);

/**
 * Export du routeur.
 *
 * Il sera enregistré dans le routeur principal
 * via router.use("/", sessionRoutes).
 */
export default router;
