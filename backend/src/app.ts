// Import du framework Express.
// Il sert à créer l'API REST de l'application.
import express from "express";

// Middleware CORS.
// Permet d'autoriser les requêtes provenant du frontend.
import cors from "cors";

// Middleware Helmet.
// Ajoute automatiquement plusieurs en-têtes HTTP
// de sécurité.
import helmet from "helmet";

// Routeur principal de l'application.
// Regroupe toutes les routes métier.
import routes from "./routes/index.routes";

// Variables d'environnement centralisées.
import { env } from "./config/env";

// Middleware de limitation du nombre de requêtes.
// Protège l'API contre les abus et les attaques.
import { globalRateLimiter } from "./middlewares/rateLimit.middleware";

// Middleware exécuté lorsqu'aucune route ne correspond.
import { notFoundMiddleware } from "./middlewares/notFound.middleware";

// Middleware global de gestion des erreurs.
import { errorMiddleware } from "./middlewares/error.middleware";

/**
 * Instance principale de l'application Express.
 */
app.set("trust proxy", 1);

/**
 * ====================================
 * Sécurisation des en-têtes HTTP
 * ====================================
 *
 * Helmet ajoute automatiquement plusieurs
 * protections de sécurité :
 *
 * - X-Content-Type-Options
 * - X-Frame-Options
 * - Referrer-Policy
 * - Content-Security-Policy (selon configuration)
 *
 * Cela réduit certains risques :
 * - clickjacking
 * - MIME sniffing
 * - attaques XSS
 */
app.use(helmet());

/**
 * ====================================
 * Configuration CORS
 * ====================================
 *
 * Autorise uniquement le frontend déclaré
 * dans les variables d'environnement.
 *
 * credentials: true permet :
 * - cookies
 * - headers d'authentification
 * - sessions sécurisées
 */
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);

/**
 * ====================================
 * Parsing JSON
 * ====================================
 *
 * Convertit automatiquement :
 *
 * {
 *   "name": "Lucas"
 * }
 *
 * en :
 *
 * req.body.name
 *
 * Limite fixée à 1 Mo pour éviter :
 * - les payloads excessifs
 * - certaines attaques DoS
 */
app.use(
  express.json({
    limit: "1mb",
  }),
);

/**
 * ====================================
 * Rate Limiting global
 * ====================================
 *
 * Limite le nombre de requêtes qu'un client
 * peut effectuer sur une période donnée.
 *
 * Objectifs :
 * - protection contre le brute force
 * - protection contre le spam
 * - limitation de charge serveur
 */
app.use(globalRateLimiter);

/**
 * ====================================
 * Routes de l'API
 * ====================================
 *
 * Toutes les routes sont préfixées par :
 *
 * /api
 *
 * Exemple :
 *
 * GET /api/auth/me
 * POST /api/auth/login
 * GET /api/groups
 */
app.use("/api", routes);

/**
 * ====================================
 * Middleware 404
 * ====================================
 *
 * Exécuté lorsqu'aucune route
 * n'a été trouvée.
 *
 * Exemple :
 *
 * GET /api/unknown
 *
 * Réponse :
 *
 * 404 Not Found
 */
app.use(notFoundMiddleware);

/**
 * ====================================
 * Middleware global d'erreurs
 * ====================================
 *
 * Capture toutes les erreurs générées :
 *
 * - AppError
 * - erreurs Prisma
 * - erreurs MongoDB
 * - erreurs inattendues
 *
 * Doit toujours être placé en dernier.
 */
app.use(errorMiddleware);
