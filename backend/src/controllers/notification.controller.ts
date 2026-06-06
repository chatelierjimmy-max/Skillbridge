/**
 * ==========================================================
 * CONTRÔLEUR DES NOTIFICATIONS
 * ==========================================================
 *
 * Ce contrôleur gère toutes les opérations liées
 * aux notifications utilisateur dans SkillBridge.
 *
 * Fonctionnalités :
 * - consulter ses notifications
 * - marquer une notification comme lue
 *
 * Les notifications sont stockées dans MongoDB
 * afin de permettre une gestion flexible des
 * événements de l'application.
 *
 * Exemples de notifications :
 * - nouvel utilisateur dans un groupe
 * - création d'une session
 * - nouveau message reçu
 * - compte désactivé
 *
 * Architecture :
 *
 * Frontend React
 *       │
 *       ▼
 * NotificationController
 *       │
 *       ▼
 * NotificationService
 *       │
 *       ▼
 * MongoDB
 */

/**
 * Importation des types Express utilisés
 * pour typer les requêtes HTTP.
 */
import type { Request, Response, NextFunction } from "express";

/**
 * Service contenant la logique métier
 * liée aux notifications.
 */
import { notificationService } from "../services/notification.service";

/**
 * Objet regroupant les actions de gestion
 * des notifications.
 */
export const notificationController = {
  /**
   * ==========================================================
   * RÉCUPÉRER LES NOTIFICATIONS DE L'UTILISATEUR
   * ==========================================================
   *
   * Route :
   * GET /notifications
   *
   * Retourne toutes les notifications
   * associées à l'utilisateur connecté.
   */
  async getMyNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Chargement des notifications
       * appartenant à l'utilisateur.
       *
       * L'identifiant est récupéré depuis
       * le token JWT décodé.
       */
      const notifications = await notificationService.getMyNotifications(
        req.user.id,
      );

      /**
       * Retour de la liste des notifications.
       */
      res.status(200).json(notifications);
    } catch (error) {
      /**
       * Transmission de l'erreur au middleware
       * global de gestion des erreurs.
       */
      next(error);
    }
  },

  /**
   * ==========================================================
   * MARQUER UNE NOTIFICATION COMME LUE
   * ==========================================================
   *
   * Route :
   * PATCH /notifications/:id/read
   *
   * Modifie l'état d'une notification
   * afin de la marquer comme lue.
   */
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Mise à jour de la notification.
       *
       * Paramètres :
       * - utilisateur connecté
       * - identifiant de la notification
       *
       * Le service vérifie généralement
       * que la notification appartient bien
       * à l'utilisateur.
       */
      const result = await notificationService.markAsRead(
        req.user.id,
        req.params.id as string,
      );

      /**
       * Retour du résultat de la mise à jour.
       */
      res.status(200).json(result);
    } catch (error) {
      /**
       * Transmission de l'erreur au middleware
       * global.
       */
      next(error);
    }
  },
};
