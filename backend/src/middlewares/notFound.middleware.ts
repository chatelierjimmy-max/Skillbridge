/**
 * ==========================================================
 * MIDDLEWARE DE GESTION DES ROUTES INEXISTANTES
 * ==========================================================
 *
 * Ce middleware est exécuté lorsqu'aucune route
 * définie dans l'application Express ne correspond
 * à la requête reçue.
 *
 * Son objectif est de :
 * - détecter les URLs inexistantes
 * - générer une erreur HTTP 404
 * - transmettre cette erreur au middleware global
 *   de gestion des erreurs
 *
 * Ce middleware doit toujours être déclaré
 * après toutes les routes de l'application.
 *
 * Architecture :
 *
 * Requête HTTP
 *       │
 *       ▼
 * Recherche d'une route
 *       │
 *       ▼
 * Route trouvée ?
 *       │
 *  ┌────┴────┐
 *  │         │
 * Oui       Non
 *  │         │
 *  ▼         ▼
 * Controller notFoundMiddleware
 *                │
 *                ▼
 *           AppError(404)
 *                │
 *                ▼
 *         errorMiddleware
 */

import type { Request, Response, NextFunction } from "express";

/**
 * Classe d'erreur personnalisée
 * utilisée dans toute l'application.
 */
import { AppError } from "../utils/AppError";

/**
 * Middleware exécuté lorsqu'aucune route
 * ne correspond à la requête.
 */
export const notFoundMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  /**
   * Création d'une erreur HTTP 404.
   *
   * req.originalUrl contient l'URL exacte
   * demandée par le client.
   *
   * Exemple :
   *
   * GET /api/test
   *
   * produira :
   *
   * Route introuvable : /api/test
   */
  next(new AppError(`Route introuvable : ${req.originalUrl}`, 404));
};
