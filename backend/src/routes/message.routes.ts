// Import du routeur Express.
// Il permet de regrouper toutes les routes liées à la messagerie.
import { Router } from "express";

// Import du contrôleur des messages.
// Il contient la logique métier associée à la gestion des messages.
import { messageController } from "../controllers/message.controller";

// Middleware d'authentification.
// Vérifie que l'utilisateur possède un JWT valide.
import { authMiddleware } from "../middlewares/auth.middleware";

// Middleware de validation des données.
import { validate } from "../middlewares/validate.middleware";

// Schémas de validation utilisés par les routes de messagerie.
import {
  // Validation du paramètre :groupId
  groupMessagesParamSchema,

  // Validation du corps de la requête lors de l'envoi d'un message
  createMessageSchema,

  // Validation du paramètre :id d'un message
  messageIdParamSchema,
} from "../schemas/message.schema";

// Création du routeur Express.
const router = Router();

/**
 * ====================================
 * Consultation des messages d'un groupe
 * ====================================
 */

/**
 * GET /groups/:groupId/messages
 *
 * Récupère l'ensemble des messages
 * d'un groupe donné.
 *
 * Seuls les utilisateurs authentifiés
 * peuvent consulter les conversations.
 *
 * Exemple :
 * GET /groups/5/messages
 */
router.get(
  "/groups/:groupId/messages",

  // Vérification du JWT
  authMiddleware,

  // Validation du paramètre groupId
  validate(groupMessagesParamSchema),

  // Récupération des messages
  messageController.getGroupMessages,
);

/**
 * ====================================
 * Création d'un message
 * ====================================
 */

/**
 * POST /groups/:groupId/messages
 *
 * Permet à un utilisateur d'envoyer
 * un nouveau message dans un groupe.
 *
 * Exemple :
 * POST /groups/5/messages
 */
router.post(
  "/groups/:groupId/messages",

  // Authentification obligatoire
  authMiddleware,

  // Validation :
  // - groupId
  // - contenu du message
  validate(createMessageSchema),

  // Création du message
  messageController.createMessage,
);

/**
 * ====================================
 * Suppression d'un message
 * ====================================
 */

/**
 * DELETE /messages/:id
 *
 * Permet de supprimer un message.
 *
 * Dans l'architecture actuelle,
 * cette opération effectue généralement
 * une suppression logique (soft delete)
 * via le repository.
 *
 * Exemple :
 * DELETE /messages/65f4a8d3c2...
 */
router.delete(
  "/messages/:id",

  // Vérification du JWT
  authMiddleware,

  // Validation de l'identifiant du message
  validate(messageIdParamSchema),

  // Suppression du message
  messageController.deleteMessage,
);

/**
 * Export du routeur.
 *
 * Il sera enregistré dans routes/index.ts
 * puis monté dans l'application Express.
 */
export default router;
