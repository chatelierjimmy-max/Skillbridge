// Import du routeur Express.
// Permet de regrouper toutes les routes liées aux groupes.
import { Router } from "express";

// Import du contrôleur des groupes.
// Il contient toute la logique métier associée aux groupes.
import { groupController } from "../controllers/group.controller";

// Middleware d'authentification.
// Vérifie que l'utilisateur possède un JWT valide.
import { authMiddleware } from "../middlewares/auth.middleware";

// Middleware de validation des données.
import { validate } from "../middlewares/validate.middleware";

// Schémas de validation utilisés pour :
// - la création d'un groupe
// - la validation de l'identifiant d'un groupe
import { createGroupSchema, groupIdParamSchema } from "../schemas/group.schema";

// Création du routeur Express.
const router = Router();

/**
 * ====================================
 * Consultation des groupes
 * ====================================
 */

/**
 * GET /groups
 *
 * Récupère la liste de tous les groupes.
 *
 * Accessible uniquement aux utilisateurs authentifiés.
 */
router.get("/", authMiddleware, groupController.getAllGroups);

/**
 * ====================================
 * Création d'un groupe
 * ====================================
 */

/**
 * POST /groups
 *
 * Permet à un utilisateur connecté
 * de créer un nouveau groupe.
 *
 * Pipeline :
 * 1. Vérification du JWT
 * 2. Validation des données
 * 3. Création du groupe
 */
router.post(
  "/",

  // Vérification de l'authentification
  authMiddleware,

  // Validation du corps de la requête
  validate(createGroupSchema),

  // Création du groupe
  groupController.createGroup,
);

/**
 * ====================================
 * Groupes de l'utilisateur connecté
 * ====================================
 */

/**
 * GET /groups/me
 *
 * Retourne tous les groupes auxquels
 * l'utilisateur connecté appartient.
 */
router.get(
  "/me",

  // Authentification obligatoire
  authMiddleware,

  groupController.getMyGroups,
);

/**
 * ====================================
 * Détails d'un groupe
 * ====================================
 */

/**
 * GET /groups/:id
 *
 * Retourne les informations complètes
 * d'un groupe spécifique.
 *
 * Exemple :
 * GET /groups/12
 */
router.get(
  "/:id",

  // Vérification du JWT
  authMiddleware,

  // Validation du paramètre :id
  validate(groupIdParamSchema),

  // Récupération du groupe
  groupController.getGroupById,
);

/**
 * ====================================
 * Rejoindre un groupe
 * ====================================
 */

/**
 * POST /groups/:id/join
 *
 * Permet à un utilisateur
 * de rejoindre un groupe.
 *
 * Exemple :
 * POST /groups/5/join
 */
router.post(
  "/:id/join",

  // Utilisateur connecté requis
  authMiddleware,

  // Validation de l'identifiant du groupe
  validate(groupIdParamSchema),

  // Ajout du membre au groupe
  groupController.joinGroup,
);

/**
 * ====================================
 * Quitter un groupe
 * ====================================
 */

/**
 * DELETE /groups/:id/leave
 *
 * Permet à un utilisateur
 * de quitter un groupe.
 *
 * Exemple :
 * DELETE /groups/5/leave
 */
router.delete(
  "/:id/leave",

  // Vérification du JWT
  authMiddleware,

  // Validation du paramètre :id
  validate(groupIdParamSchema),

  // Suppression de l'utilisateur du groupe
  groupController.leaveGroup,
);

/**
 * Export du routeur afin qu'il puisse
 * être enregistré dans l'application Express.
 */
export default router;
