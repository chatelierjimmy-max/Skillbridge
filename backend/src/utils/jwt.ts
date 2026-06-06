// Bibliothèque jsonwebtoken.
// Permet de générer et vérifier des JWT
// (JSON Web Tokens).
import jwt from "jsonwebtoken";

// Type utilisé pour configurer la signature du token.
import type { SignOptions } from "jsonwebtoken";

// Type provenant de la bibliothèque "ms".
// Utilisé pour typer correctement expiresIn.
import type { StringValue } from "ms";

// Type Prisma représentant les rôles utilisateur.
import type { UserRole } from "@prisma/client";

// Variables d'environnement centralisées.
import { env } from "../config/env";

/**
 * Structure du payload JWT.
 *
 * Ces données seront stockées
 * à l'intérieur du token signé.
 */
export interface JwtPayload {
  /**
   * Identifiant de l'utilisateur.
   */
  userId: number;

  /**
   * Rôle de l'utilisateur.
   *
   * Utilisé pour :
   * - l'autorisation
   * - les routes protégées
   * - les contrôles d'accès
   */
  role: UserRole;
}

/**
 * Génère un token JWT signé.
 *
 * @param payload Données à inclure dans le token
 * @returns JWT signé
 */
export const generateToken = (payload: JwtPayload): string => {
  /**
   * Configuration du token.
   *
   * expiresIn définit la durée de validité.
   *
   * Exemples :
   * - "1h"
   * - "24h"
   * - "7d"
   * - "30m"
   */
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as StringValue,
  };

  /**
   * Signature du token.
   *
   * Paramètres :
   * - payload utilisateur
   * - secret JWT
   * - options de signature
   */
  return jwt.sign(payload, env.jwtSecret, options);
};

/**
 * Vérifie et décode un token JWT.
 *
 * @param token JWT reçu depuis le client
 * @returns Payload utilisateur décodé
 *
 * @throws JsonWebTokenError
 * @throws TokenExpiredError
 */
export const verifyToken = (token: string): JwtPayload => {
  /**
   * Vérification :
   * - signature
   * - intégrité
   * - expiration
   *
   * Si le token est invalide,
   * une exception est automatiquement levée.
   */
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};
