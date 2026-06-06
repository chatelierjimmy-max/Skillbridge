/**
 * ==========================================================
 * CONTROLLER D'ADMINISTRATION
 * ==========================================================
 *
 * Ce contrôleur gère toutes les routes réservées
 * aux administrateurs de SkillBridge.
 *
 * Responsabilités :
 * - consulter les utilisateurs
 * - désactiver un compte
 * - réactiver un compte
 * - consulter les logs d'activité
 * - consulter les logs de sécurité
 *
 * Architecture :
 *
 * Route HTTP
 *      │
 *      ▼
 * Controller
 *      │
 *      ▼
 * Service
 *      │
 *      ▼
 * Base de données
 */

/**
 * Types Express utilisés pour typer
 * les paramètres des méthodes du contrôleur.
 */
import type { Request, Response, NextFunction } from "express";

/**
 * Service métier contenant la logique
 * d'administration.
 */
import { adminService } from "../services/admin.service";

/**
 * Objet regroupant toutes les actions
 * administrateur.
 */
export const adminController = {
  /**
   * ==========================================================
   * RÉCUPÉRER LA LISTE DES UTILISATEURS
   * ==========================================================
   *
   * Route :
   * GET /admin/users
   *
   * Retourne tous les utilisateurs.
   */
  async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Appel du service.
       */
      const users = await adminService.getUsers();

      /**
       * Réponse HTTP 200.
       */
      res.status(200).json(users);
    } catch (error) {
      /**
       * Transmission de l'erreur
       * au middleware global.
       */
      next(error);
    }
  },

  /**
   * ==========================================================
   * DÉSACTIVER UN UTILISATEUR
   * ==========================================================
   *
   * Route :
   * PATCH /admin/users/:id/disable
   *
   * Paramètres :
   * - req.user.id = administrateur
   * - req.params.id = utilisateur cible
   */
  async disableUser(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Désactivation du compte.
       *
       * On transmet :
       * - l'ID de l'administrateur
       * - l'ID de l'utilisateur ciblé
       */
      const user = await adminService.disableUser(
        req.user.id,
        Number(req.params.id),
      );

      /**
       * Réponse de succès.
       */
      res.status(200).json({
        /**
         * Message utilisateur.
         */
        message: "Utilisateur désactivé",

        /**
         * Utilisateur mis à jour.
         */
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * RÉACTIVER UN UTILISATEUR
   * ==========================================================
   *
   * Route :
   * PATCH /admin/users/:id/enable
   */
  async enableUser(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Réactivation du compte.
       */
      const user = await adminService.enableUser(
        req.user.id,
        Number(req.params.id),
      );

      /**
       * Réponse HTTP.
       */
      res.status(200).json({
        message: "Utilisateur réactivé",
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * RÉCUPÉRATION DES LOGS D'ACTIVITÉ
   * ==========================================================
   *
   * Route :
   * GET /admin/logs/activity
   *
   * Retourne les actions effectuées
   * dans l'application.
   */
  async getActivityLogs(_req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Chargement des logs MongoDB.
       */
      const logs = await adminService.getActivityLogs();

      /**
       * Réponse HTTP.
       */
      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * RÉCUPÉRATION DES LOGS DE SÉCURITÉ
   * ==========================================================
   *
   * Route :
   * GET /admin/logs/security
   *
   * Retourne les événements liés
   * à la sécurité.
   */
  async getSecurityLogs(_req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Chargement des logs.
       */
      const logs = await adminService.getSecurityLogs();

      /**
       * Réponse HTTP.
       */
      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  },
};
