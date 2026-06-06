// Import du routeur Express.
// Il permet de regrouper toutes les routes liées aux compétences.
import { Router } from "express";

// Import du contrôleur des compétences.
// Il contient la logique métier associée à la gestion des skills.
import { skillController } from "../controllers/skill.controller";

// Middleware d'authentification.
// Vérifie que l'utilisateur possède un JWT valide.
import { authMiddleware } from "../middlewares/auth.middleware";

// Middleware de validation.
// Vérifie que les données reçues respectent les schémas définis.
import { validate } from "../middlewares/validate.middleware";

// Schémas de validation utilisés pour :
// - l'ajout d'une compétence utilisateur
// - la suppression d'une compétence utilisateur
import {
  addUserSkillSchema,
  skillIdParamSchema,
} from "../schemas/skill.schema";

// Création du routeur Express.
const router = Router();

/**
 * ====================================
 * Catalogue des compétences
 * ====================================
 */

/**
 * GET /users/skills
 *
 * Retourne la liste complète des compétences
 * disponibles dans l'application.
 *
 * Cette route est généralement utilisée pour :
 * - remplir des listes déroulantes
 * - proposer des compétences lors de l'inscription
 * - permettre l'ajout de nouvelles compétences au profil
 *
 * Exemple :
 * GET /users/skills
 */
router.get(
  "/skills",

  // Vérification de l'authentification
  authMiddleware,

  // Récupération du catalogue des compétences
  skillController.getAllSkills,
);

/**
 * ====================================
 * Compétences de l'utilisateur connecté
 * ====================================
 */

/**
 * GET /users/me/skills
 *
 * Retourne toutes les compétences
 * associées à l'utilisateur connecté.
 *
 * Chaque compétence est accompagnée
 * de son niveau de maîtrise.
 *
 * Exemple :
 * GET /users/me/skills
 */
router.get(
  "/me/skills",

  // Authentification obligatoire
  authMiddleware,

  // Récupération des compétences utilisateur
  skillController.getMySkills,
);

/**
 * ====================================
 * Ajout ou mise à jour d'une compétence
 * ====================================
 */

/**
 * POST /users/me/skills
 *
 * Permet d'ajouter une compétence
 * au profil utilisateur.
 *
 * Si la compétence existe déjà,
 * son niveau sera mis à jour grâce
 * au mécanisme d'upsert du repository.
 *
 * Exemple :
 *
 * {
 *   "skillId": 5,
 *   "level": "INTERMEDIATE"
 * }
 */
router.post(
  "/me/skills",

  // Vérification du JWT
  authMiddleware,

  // Validation des données envoyées
  validate(addUserSkillSchema),

  // Ajout de la compétence
  skillController.addMySkill,
);

/**
 * ====================================
 * Suppression d'une compétence
 * ====================================
 */

/**
 * DELETE /users/me/skills/:skillId
 *
 * Supprime une compétence
 * du profil utilisateur.
 *
 * Seule la relation UserSkill est supprimée.
 * La compétence reste disponible
 * dans le catalogue général.
 *
 * Exemple :
 * DELETE /users/me/skills/5
 */
router.delete(
  "/me/skills/:skillId",

  // Authentification obligatoire
  authMiddleware,

  // Validation du paramètre skillId
  validate(skillIdParamSchema),

  // Suppression de la compétence
  skillController.removeMySkill,
);

/**
 * Export du routeur.
 *
 * Il sera enregistré dans le routeur principal :
 *
 * router.use("/users", skillRoutes);
 */
export default router;
