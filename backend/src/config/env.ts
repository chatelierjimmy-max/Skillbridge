/**
 * ==========================================================
 * CONFIGURATION DES VARIABLES D'ENVIRONNEMENT
 * ==========================================================
 *
 * Ce fichier centralise l'accès aux variables
 * d'environnement de l'application.
 *
 * Son rôle est de :
 * - charger le fichier .env
 * - vérifier les variables obligatoires
 * - fournir une configuration typée
 * - empêcher le démarrage si une variable manque
 *
 * Utilisé par :
 * - la connexion PostgreSQL
 * - la connexion MongoDB
 * - l'authentification JWT
 * - la configuration CORS
 * - le serveur Express
 */

/**
 * Importation de dotenv.
 *
 * Dotenv permet de charger automatiquement
 * les variables présentes dans le fichier .env
 * vers process.env.
 */
import dotenv from "dotenv";

/**
 * Chargement du fichier .env.
 *
 * Exemple :
 *
 * DATABASE_URL=postgresql://...
 * MONGO_URI=mongodb://...
 * JWT_SECRET=secret
 * FRONTEND_URL=http://localhost:5173
 */
dotenv.config();

/**
 * ==========================================================
 * VARIABLES OBLIGATOIRES
 * ==========================================================
 *
 * Ces variables doivent impérativement être
 * définies avant le démarrage du serveur.
 *
 * Si l'une d'elles est absente,
 * l'application s'arrête immédiatement.
 */
const requiredEnv = [
  /**
   * URL de connexion PostgreSQL.
   */
  "DATABASE_URL",

  /**
   * URI de connexion MongoDB.
   */
  "MONGO_URI",

  /**
   * Clé secrète utilisée pour signer
   * les JWT.
   */
  "JWT_SECRET",

  /**
   * URL du frontend autorisé.
   */
  "FRONTEND_URL",
];

/**
 * Vérification de toutes les variables
 * obligatoires.
 */
requiredEnv.forEach((key) => {
  /**
   * Si la variable n'existe pas,
   * le serveur est arrêté.
   */
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

/**
 * ==========================================================
 * OBJET DE CONFIGURATION GLOBAL
 * ==========================================================
 *
 * Cet objet est utilisé dans toute
 * l'application afin d'éviter les accès
 * directs à process.env.
 */
export const env = {
  /**
   * Port du serveur Express.
   *
   * Valeur par défaut :
   * 5000
   */
  port: process.env.PORT || "5000",

  /**
   * URL PostgreSQL.
   *
   * Utilisée par Prisma.
   */
  databaseUrl: process.env.DATABASE_URL as string,

  /**
   * URI MongoDB.
   *
   * Utilisée pour :
   * - logs d'activité
   * - logs de sécurité
   * - messagerie
   * - notifications
   */
  mongoUri: process.env.MONGO_URI as string,

  /**
   * Clé secrète JWT.
   *
   * Sert à :
   * - signer les tokens
   * - vérifier les tokens
   */
  jwtSecret: process.env.JWT_SECRET as string,

  /**
   * Durée de validité des JWT.
   *
   * Exemple :
   * 1h
   * 24h
   * 7d
   *
   * Valeur par défaut :
   * 1 heure
   */
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",

  /**
   * URL du frontend autorisé.
   *
   * Utilisée pour CORS.
   *
   * Exemple :
   * http://localhost:5173
   */
  frontendUrl: process.env.FRONTEND_URL as string,

  /**
   * Environnement d'exécution.
   *
   * Valeurs possibles :
   * development
   * production
   * test
   *
   * Valeur par défaut :
   * development
   */
  nodeEnv: process.env.NODE_ENV || "development",
};
