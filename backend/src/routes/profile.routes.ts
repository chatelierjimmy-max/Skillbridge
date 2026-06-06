// Import du routeur Express.
// Il permet de regrouper les routes liées aux profils utilisateurs.
import { Router } from "express";

// Import du contrôleur de profil.
// Il contient la logique métier permettant
// de consulter et modifier un profil.
import { profileController } from "../controllers/profile.controller";

// Middleware d'authentification.
// Vérifie la présence et la validité du JWT.
import { authMiddleware } from "../middlewares/auth.middleware";

// Middleware de validation.
// Vérifie que les données reçues respectent
// le schéma attendu.
import { validate } from "../middlewares/validate.middleware";

// Schéma de validation utilisé lors
// de la modification du profil.
import { updateProfileSchema } from "../schemas/profile.schema";

// Création du routeur Express.
const router = Router();

/**
 * ====================================
 * Consultation du profil utilisateur
 * ====================================
 */

/**
 * GET /users/me/profile
 *
 * Retourne le profil de l'utilisateur connecté.
 *
 * Cette route permet de récupérer :
 * - la biographie
 * - le niveau
 * - la disponibilité
 * - la localisation
 *
 * Exemple :
 * GET /users/me/profile
 */
router.get(
  "/me/profile",

  // Vérification du JWT
  authMiddleware,

  // Récupération du profil utilisateur
  profileController.getMyProfile,
);

/**
 * ====================================
 * Mise à jour du profil utilisateur
 * ====================================
 */

/**
 * PUT /users/me/profile
 *
 * Met à jour le profil de l'utilisateur connecté.
 *
 * Les données sont validées avant
 * d'être transmises au contrôleur.
 *
 * Exemple :
 *
 * {
 *   "bio": "Développeur Full Stack",
 *   "level": "INTERMEDIATE",
 *   "availability": "Soirs et week-ends",
 *   "location": "Lyon"
 * }
 */
router.put(
  "/me/profile",

  // Authentification obligatoire
  authMiddleware,

  // Validation du corps de la requête
  validate(updateProfileSchema),

  // Mise à jour du profil
  profileController.updateMyProfile,
);

/**
 * Export du routeur.
 *
 * Il sera monté dans le routeur principal :
 *
 * router.use("/users", profileRoutes);
 */
export default router;
