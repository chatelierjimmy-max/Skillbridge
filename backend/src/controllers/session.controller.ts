/**
 * ==========================================================
 * CONTRÔLEUR DES SESSIONS DE TRAVAIL
 * ==========================================================
 *
 * Ce contrôleur gère toutes les opérations liées
 * aux sessions collaboratives de SkillBridge.
 *
 * Fonctionnalités :
 * - consulter les sessions d'un groupe
 * - créer une session
 * - s'inscrire à une session
 * - annuler une inscription
 * - consulter ses propres sessions
 *
 * Les sessions permettent aux membres d'un groupe
 * d'organiser des réunions de travail autour
 * d'une compétence ou d'un sujet précis.
 *
 * Architecture :
 *
 * Frontend React
 *       │
 *       ▼
 * SessionController
 *       │
 *       ▼
 * SessionService
 *       │
 *       ▼
 * MariaDB (Prisma)
 */

import type { Request, Response, NextFunction } from "express";

/**
 * Service contenant toute la logique métier
 * des sessions.
 */
import { sessionService } from "../services/session.service";

/**
 * Objet regroupant toutes les actions
 * liées aux sessions.
 */
export const sessionController = {
  /**
   * ==========================================================
   * RÉCUPÉRER LES SESSIONS D'UN GROUPE
   * ==========================================================
   *
   * Route :
   * GET /groups/:groupId/sessions
   *
   * Retourne toutes les sessions associées
   * à un groupe donné.
   */
  async getGroupSessions(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Chargement des sessions du groupe.
       *
       * Paramètres :
       * - utilisateur connecté
       * - identifiant du groupe
       */
      const sessions = await sessionService.getGroupSessions(
        req.user.id,
        Number(req.params.groupId),
      );

      /**
       * Retour des sessions trouvées.
       */
      res.status(200).json(sessions);
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * CRÉER UNE SESSION
   * ==========================================================
   *
   * Route :
   * POST /groups/:groupId/sessions
   *
   * Permet à un membre du groupe
   * de planifier une nouvelle session.
   */
  async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Création de la session.
       *
       * Paramètres :
       * - utilisateur créateur
       * - groupe concerné
       * - données de la session
       */
      const session = await sessionService.createSession(
        req.user.id,
        Number(req.params.groupId),
        req.body,
      );

      /**
       * Retour HTTP 201.
       *
       * 201 = ressource créée.
       */
      res.status(201).json({
        /**
         * Message de confirmation.
         */
        message: "Session créée",

        /**
         * Identifiant de la session créée.
         */
        sessionId: session.id,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * INSCRIPTION À UNE SESSION
   * ==========================================================
   *
   * Route :
   * POST /sessions/:id/book
   *
   * Permet à un utilisateur de réserver
   * une place dans une session.
   */
  async bookSession(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Inscription de l'utilisateur.
       *
       * Paramètres :
       * - utilisateur connecté
       * - identifiant de la session
       */
      const result = await sessionService.bookSession(
        req.user.id,
        Number(req.params.id),
      );

      /**
       * Retour du résultat.
       */
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * ANNULER UNE INSCRIPTION
   * ==========================================================
   *
   * Route :
   * DELETE /sessions/:id/book
   *
   * Permet à un utilisateur de retirer
   * sa réservation.
   */
  async cancelBooking(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Suppression de l'inscription.
       */
      const result = await sessionService.cancelBooking(
        req.user.id,
        Number(req.params.id),
      );

      /**
       * Retour du résultat.
       */
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * RÉCUPÉRER MES SESSIONS
   * ==========================================================
   *
   * Route :
   * GET /users/me/sessions
   *
   * Retourne toutes les sessions
   * auxquelles l'utilisateur est inscrit.
   */
  async getMySessions(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Chargement des sessions
       * de l'utilisateur connecté.
       */
      const sessions = await sessionService.getMySessions(req.user.id);

      /**
       * Retour des résultats.
       */
      res.status(200).json(sessions);
    } catch (error) {
      next(error);
    }
  },
};
