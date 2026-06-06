/**
 * ==========================================================
 * MIDDLEWARE D'AUTHENTIFICATION JWT
 * ==========================================================
 *
 * Ce middleware protège les routes privées
 * de l'application SkillBridge.
 *
 * Son rôle est de :
 * - récupérer le token JWT envoyé par le client
 * - vérifier sa validité
 * - extraire les informations utilisateur
 * - les ajouter à la requête
 * - autoriser ou refuser l'accès
 *
 * Toutes les routes nécessitant une connexion
 * passent par ce middleware avant d'atteindre
 * les contrôleurs.
 *
 * Architecture :
 *
 * Client React
 *       │
 *       ▼
 * Authorization: Bearer JWT
 *       │
 *       ▼
 * authMiddleware
 *       │
 *       ▼
 * Contrôleur
 *       │
 *       ▼
 * Service
 */

/**
 * Importation des types Express
 * utilisés pour typer les requêtes.
 */
import type { Request, Response, NextFunction } from "express";

/**
 * Classe personnalisée permettant
 * de générer des erreurs HTTP.
 */
import { AppError } from "../utils/AppError";

/**
 * Fonction de vérification du JWT.
 *
 * Cette fonction :
 * - vérifie la signature
 * - vérifie l'expiration
 * - retourne les données du token
 */
import { verifyToken } from "../utils/jwt";

/**
 * Middleware d'authentification.
 *
 * Il est exécuté avant les contrôleurs
 * sur toutes les routes protégées.
 */
export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  /**
   * Récupération de l'en-tête Authorization.
   *
   * Exemple :
   *
   * Authorization: Bearer eyJhbGciOi...
   */
  const authHeader = req.headers.authorization;

  /**
   * Vérification de la présence
   * de l'en-tête Authorization.
   */
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    /**
     * Refus d'accès.
     */
    next(new AppError("Token manquant", 401));

    return;
  }

  /**
   * Extraction du token.
   *
   * Exemple :
   *
   * "Bearer abc123"
   *
   * devient :
   *
   * "abc123"
   */
  const token = authHeader.slice("Bearer ".length);

  try {
    /**
     * Vérification du JWT.
     *
     * Cette étape contrôle :
     * - la signature
     * - la date d'expiration
     * - l'intégrité du token
     */
    const payload = verifyToken(token);

    /**
     * Injection des informations
     * utilisateur dans la requête.
     *
     * Elles seront ensuite accessibles
     * dans tous les contrôleurs.
     */
    req.user = {
      /**
       * Identifiant utilisateur.
       */
      id: payload.userId,

      /**
       * Rôle utilisateur.
       *
       * USER
       * ADMIN
       */
      role: payload.role,
    };

    /**
     * Passage au middleware suivant
     * ou au contrôleur.
     */
    next();
  } catch {
    /**
     * Le token est :
     * - invalide
     * - modifié
     * - expiré
     */
    next(new AppError("Token invalide ou expiré", 401));
  }
};
