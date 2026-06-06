// Import du routeur Express.
// Il permet de regrouper les routes liées aux notifications.
import { Router } from "express";

// Import du contrôleur des notifications.
// Il contient la logique métier associée à la consultation
// et à la mise à jour des notifications.
import { notificationController } from "../controllers/notification.controller";

// Middleware d'authentification.
// Vérifie que l'utilisateur possède un JWT valide.
import { authMiddleware } from "../middlewares/auth.middleware";

// Création du routeur Express.
const router = Router();

/**
 * ====================================
 * Consultation des notifications
 * ====================================
 */

/**
 * GET /notifications
 *
 * Récupère toutes les notifications
 * de l'utilisateur connecté.
 *
 * Les notifications sont généralement
 * triées de la plus récente à la plus ancienne.
 *
 * Exemple :
 * GET /notifications
 */
router.get(
  "/notifications",

  // Vérifie que l'utilisateur est authentifié
  authMiddleware,

  // Retourne les notifications de l'utilisateur connecté
  notificationController.getMyNotifications,
);

/**
 * ====================================
 * Marquer une notification comme lue
 * ====================================
 */

/**
 * PATCH /notifications/:id/read
 *
 * Permet de marquer une notification
 * comme étant lue.
 *
 * Cette opération modifie généralement
 * le champ :
 *
 * isRead = true
 *
 * Exemple :
 * PATCH /notifications/665f7c8a/read
 */
router.patch(
  "/notifications/:id/read",

  // Vérifie l'authentification
  authMiddleware,

  // Mise à jour du statut de lecture
  notificationController.markAsRead,
);

/**
 * Export du routeur.
 *
 * Il sera enregistré dans le routeur principal
 * puis monté dans l'application Express.
 */
export default router;
