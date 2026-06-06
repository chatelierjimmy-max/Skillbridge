/**
 * ==========================================================
 * MIDDLEWARE DE GESTION DES RÔLES
 * ==========================================================
 *
 * Ce middleware contrôle les autorisations
 * des utilisateurs authentifiés.
 *
 * Son rôle est de :
 * - vérifier que l'utilisateur est connecté
 * - récupérer son compte en base de données
 * - vérifier que son compte est actif
 * - vérifier qu'il possède le rôle requis
 * - autoriser ou refuser l'accès
 *
 * Ce middleware est utilisé pour protéger
 * les routes réservées à certains profils :
 *
 * Exemple :
 * - administrateurs
 * - modérateurs
 * - gestionnaires
 *
 * Architecture :
 *
 * Client
 *    │
 *    ▼
 * authMiddleware
 *    │
 *    ▼
 * roleMiddleware
 *    │
 * ┌──┴──┐
 * │     │
 * OK  Refus
 * │     │
 * ▼     ▼
 * Route 403
 */

import type { Request, Response, NextFunction } from "express";

import { UserStatus } from "@prisma/client";

import type { UserRole } from "@prisma/client";

/**
 * Classe d'erreur personnalisée.
 */
import { AppError } from "../utils/AppError";

/**
 * Repository permettant
 * l'accès aux utilisateurs.
 */
import { userRepository } from "../repositories/user.repository";

/**
 * ==========================================================
 * FACTORY DE MIDDLEWARE
 * ==========================================================
 *
 * Cette fonction reçoit une liste de rôles
 * autorisés et retourne un middleware Express.
 *
 * Exemple :
 *
 * roleMiddleware("ADMIN")
 *
 * ou
 *
 * roleMiddleware("ADMIN", "USER")
 */
export const roleMiddleware =
  (...roles: UserRole[]) =>
  /**
   * Middleware réellement exécuté
   * lors de la requête.
   */
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      /**
       * Vérification de la présence
       * d'un utilisateur authentifié.
       *
       * Cette information est normalement
       * injectée par authMiddleware.
       */
      if (!req.user) {
        next(new AppError("Accès interdit", 403));

        return;
      }

      /**
       * Récupération du compte
       * utilisateur en base.
       *
       * Cette vérification garantit
       * que les informations sont
       * toujours à jour.
       */
      const user = await userRepository.findById(req.user.id);

      /**
       * Vérifications :
       *
       * 1. utilisateur existe
       * 2. compte actif
       * 3. rôle autorisé
       */
      if (
        !user ||
        user.status !== UserStatus.ACTIVE ||
        !roles.includes(user.role)
      ) {
        next(new AppError("Accès interdit", 403));

        return;
      }

      /**
       * Synchronisation du rôle
       * avec la valeur actuelle
       * en base de données.
       *
       * Cela évite d'utiliser un rôle
       * potentiellement obsolète
       * présent dans le JWT.
       */
      req.user.role = user.role;

      /**
       * Autorisation accordée.
       */
      next();
    } catch (error) {
      /**
       * Transmission de l'erreur
       * au middleware global.
       */
      next(error);
    }
  };
