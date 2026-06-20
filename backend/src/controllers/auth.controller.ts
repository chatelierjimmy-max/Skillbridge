/**
 * ==========================================================
 * CONTRÔLEUR D'AUTHENTIFICATION
 * ==========================================================
 *
 * Ce contrôleur gère toutes les opérations liées
 * à l'authentification des utilisateurs.
 *
 * Fonctionnalités :
 * - inscription
 * - connexion
 * - récupération du profil connecté
 *
 * Il reçoit les requêtes HTTP, appelle les méthodes
 * du service d'authentification puis renvoie les
 * réponses au client.
 *
 * Architecture :
 *
 * Frontend
 *     │
 *     ▼
 * AuthController
 *     │
 *     ▼
 * AuthService
 *     │
 *     ▼
 * Prisma / MongoDB
 */

/**
 * Importation des types Express.
 */
import type { Request, Response, NextFunction } from "express";

/**
 * Service contenant la logique métier
 * d'authentification.
 */
import { authService } from "../services/auth.service";

/**
 * Objet regroupant toutes les actions
 * d'authentification.
 */
export const authController = {
  /**
   * ==========================================================
   * INSCRIPTION
   * ==========================================================
   *
   * Route :
   * POST /auth/register
   *
   * Crée un nouveau compte utilisateur.
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Informations de contexte utilisées
       * pour les logs de sécurité.
       *
       * Exemple :
       * - adresse IP
       * - navigateur utilisé
       */
      const context = {
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      };

      /**
       * Création du compte.
       *
       * req.body contient :
       * - firstname
       * - lastname
       * - email
       * - password
       */
      await authService.register(req.body, context);

      /**
       * Réponse HTTP 201.
       *
       * 201 = ressource créée.
       */
      res.status(201).json({
        message: "Compte créé avec succès",
      });
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
   * CONNEXION
   * ==========================================================
   *
   * Route :
   * POST /auth/login
   *
   * Vérifie les identifiants puis
   * génère un token JWT.
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Informations utilisées
       * pour les logs de sécurité.
       */
      const context = {
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      };

      /**
       * Tentative d'authentification.
       */
      const result = await authService.login(req.body, context);

      /**
       * Réponse de succès.
       *
       * Contient généralement :
       * - accessToken
       * - utilisateur
       */
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const context = {
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      };

      const result = await authService.forgotPassword(req.body, context);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const context = {
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      };

      const result = await authService.resetPassword(req.body, context);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * UTILISATEUR CONNECTÉ
   * ==========================================================
   *
   * Route :
   * GET /auth/me
   *
   * Retourne les informations du compte
   * actuellement authentifié.
   */
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * L'identifiant utilisateur est
       * injecté par le middleware JWT.
       *
       * Exemple :
       *
       * req.user = {
       *   id: 1,
       *   role: "USER"
       * }
       */
      const user = await authService.me(req.user.id);

      /**
       * Retour des informations
       * de l'utilisateur connecté.
       */
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
};
