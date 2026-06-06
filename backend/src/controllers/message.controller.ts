/**
 * ==========================================================
 * CONTRÔLEUR DE MESSAGERIE
 * ==========================================================
 *
 * Ce contrôleur gère toutes les fonctionnalités
 * liées à la messagerie collaborative des groupes.
 *
 * Fonctionnalités :
 * - consulter les messages d'un groupe
 * - envoyer un message
 * - supprimer un message
 *
 * Les messages sont stockés dans MongoDB
 * afin de bénéficier d'une structure souple
 * adaptée aux échanges temps réel.
 *
 * Architecture :
 *
 * Frontend React
 *       │
 *       ▼
 * MessageController
 *       │
 *       ▼
 * MessageService
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
 * Service contenant toute la logique métier
 * liée aux messages.
 */
import { messageService } from "../services/message.service";

/**
 * Objet regroupant les actions de messagerie.
 */
export const messageController = {
  /**
   * ==========================================================
   * RÉCUPÉRATION DES MESSAGES D'UN GROUPE
   * ==========================================================
   *
   * Route :
   * GET /groups/:groupId/messages
   *
   * Retourne tous les messages
   * associés à un groupe.
   */
  async getGroupMessages(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Chargement des messages.
       *
       * Paramètres :
       * - utilisateur connecté
       * - identifiant du groupe
       *
       * Le service vérifie généralement
       * que l'utilisateur appartient au groupe.
       */
      const messages = await messageService.getGroupMessages(
        req.user.id,
        Number(req.params.groupId),
      );

      /**
       * Retour de la liste des messages.
       */
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * ENVOI D'UN MESSAGE
   * ==========================================================
   *
   * Route :
   * POST /groups/:groupId/messages
   *
   * Permet à un membre du groupe
   * d'envoyer un nouveau message.
   */
  async createMessage(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Création du message.
       *
       * Paramètres :
       * - utilisateur connecté
       * - groupe cible
       * - contenu du message
       */
      const message = await messageService.createMessage(
        req.user.id,
        Number(req.params.groupId),
        req.body,
      );

      /**
       * Réponse HTTP 201.
       *
       * 201 = ressource créée.
       */
      res.status(201).json({
        /**
         * Message de confirmation.
         */
        message: "Message envoyé",

        /**
         * Message créé.
         */
        data: message,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * SUPPRESSION D'UN MESSAGE
   * ==========================================================
   *
   * Route :
   * DELETE /messages/:id
   *
   * Permet de supprimer un message.
   *
   * Généralement autorisé :
   * - à l'auteur du message
   * - au propriétaire du groupe
   */
  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Suppression du message.
       *
       * Paramètres :
       * - utilisateur connecté
       * - identifiant du message
       */
      const result = await messageService.deleteMessage(
        req.user.id,
        req.params.id as string,
      );

      /**
       * Retour du résultat.
       */
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
