/**
 * ==========================================================
 * MIDDLEWARE GLOBAL DE GESTION DES ERREURS
 * ==========================================================
 *
 * Ce middleware centralise toutes les erreurs
 * générées dans l'application Express.
 *
 * Son rôle est de :
 * - intercepter les erreurs remontées par next(error)
 * - déterminer le code HTTP approprié
 * - envoyer une réponse JSON standardisée
 * - afficher la stack trace en développement
 *
 * Grâce à ce middleware, tous les contrôleurs
 * peuvent simplement transmettre leurs erreurs
 * sans avoir à gérer eux-mêmes les réponses HTTP.
 *
 * Architecture :
 *
 * Contrôleur
 *      │
 *      ▼
 * next(error)
 *      │
 *      ▼
 * errorMiddleware
 *      │
 *      ▼
 * Réponse JSON
 */

import type { Request, Response, NextFunction } from "express";

/**
 * Classe d'erreur personnalisée.
 *
 * Elle permet de définir :
 * - un message
 * - un code HTTP
 *
 * Exemple :
 *
 * throw new AppError("Utilisateur introuvable", 404);
 */
import { AppError } from "../utils/AppError";

/**
 * Configuration de l'environnement.
 *
 * Utilisée notamment pour savoir
 * si l'application est en mode :
 *
 * - development
 * - production
 */
import { env } from "../config/env";

/**
 * Middleware global de gestion des erreurs.
 *
 * Express reconnaît automatiquement
 * un middleware d'erreur grâce à la
 * présence du paramètre "error"
 * en première position.
 */
export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  /**
   * Détermination du code HTTP.
   *
   * Si l'erreur est une AppError,
   * on utilise son code personnalisé.
   *
   * Sinon :
   *
   * 500 = erreur serveur.
   */
  const statusCode = error instanceof AppError ? error.statusCode : 500;

  /**
   * Construction de la réponse JSON.
   */
  res.status(statusCode).json({
    /**
     * Message d'erreur envoyé au client.
     */
    error: error.message || "Erreur interne du serveur",

    /**
     * La stack trace est exposée
     * uniquement en développement.
     *
     * Cela facilite le débogage
     * tout en évitant de divulguer
     * des informations sensibles
     * en production.
     */
    ...(env.nodeEnv === "development" && {
      stack: error.stack,
    }),
  });
};
