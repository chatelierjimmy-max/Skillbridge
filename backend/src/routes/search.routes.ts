// Import du routeur Express.
// Il permet de regrouper les routes liées à la recherche d'apprenants.
import { Router } from "express";

// Import du contrôleur de recherche.
// Il contient la logique métier permettant
// de rechercher des utilisateurs selon différents critères.
import { searchController } from "../controllers/search.controller";

// Middleware d'authentification.
// Vérifie que l'utilisateur possède un JWT valide.
import { authMiddleware } from "../middlewares/auth.middleware";

// Middleware de validation.
// Vérifie que les paramètres de recherche
// respectent le schéma attendu.
import { validate } from "../middlewares/validate.middleware";

// Schéma de validation utilisé pour les filtres de recherche.
import { searchLearnersSchema } from "../schemas/search.schema";

// Création du routeur Express.
const router = Router();

/**
 * ====================================
 * Recherche d'apprenants
 * ====================================
 */

/**
 * GET /users/search
 *
 * Permet de rechercher des apprenants
 * selon différents critères :
 *
 * - compétence
 * - niveau
 * - ville
 * - pagination
 *
 * Tous les filtres sont transmis
 * sous forme de paramètres de requête.
 *
 * Exemple :
 *
 * GET /users/search?skill=React
 *
 * GET /users/search?skill=TypeScript&level=INTERMEDIATE
 *
 * GET /users/search?city=Lyon&page=1&limit=10
 */
router.get(
  "/search",

  /**
   * Vérifie que l'utilisateur est authentifié.
   *
   * Seuls les membres connectés peuvent
   * accéder au moteur de recherche.
   */
  authMiddleware,

  /**
   * Validation des paramètres de recherche.
   *
   * Vérifie notamment :
   * - skill
   * - level
   * - city
   * - page
   * - limit
   */
  validate(searchLearnersSchema),

  /**
   * Exécute la recherche.
   *
   * Le contrôleur récupère les filtres,
   * construit la requête et retourne
   * les apprenants correspondants.
   */
  searchController.searchLearners,
);

/**
 * Export du routeur.
 *
 * Il sera monté dans le routeur principal :
 *
 * router.use("/users", searchRoutes);
 */
export default router;
