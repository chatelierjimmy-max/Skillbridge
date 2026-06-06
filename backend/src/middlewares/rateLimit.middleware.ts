/**
 * ==========================================================
 * CONFIGURATION DES RATE LIMITERS
 * ==========================================================
 *
 * Ce fichier définit les mécanismes de limitation
 * du nombre de requêtes autorisées par client.
 *
 * Objectifs :
 * - protéger l'API contre les attaques par force brute
 * - limiter les abus
 * - réduire les risques de surcharge serveur
 * - améliorer la sécurité globale de SkillBridge
 *
 * La bibliothèque express-rate-limit surveille
 * automatiquement les requêtes effectuées depuis
 * une même adresse IP.
 *
 * Architecture :
 *
 * Client
 *    │
 *    ▼
 * Rate Limiter
 *    │
 * ┌──┴──┐
 * │     │
 * OK   Bloqué
 * │     │
 * ▼     ▼
 * API   429 Too Many Requests
 */

import rateLimit from "express-rate-limit";
import { env } from "../config/env";

/**
 * ==========================================================
 * DÉSACTIVATION DES LIMITES EN TEST
 * ==========================================================
 *
 * Les tests automatisés peuvent effectuer
 * un très grand nombre de requêtes.
 *
 * Sans cette condition, les tests pourraient
 * être bloqués artificiellement.
 */
const skipInTest = (): boolean => env.nodeEnv === "test";

/**
 * ==========================================================
 * RATE LIMITER GLOBAL
 * ==========================================================
 *
 * Appliqué à l'ensemble de l'API.
 *
 * Limites :
 * - 100 requêtes
 * - sur une période de 15 minutes
 *
 * Exemple :
 *
 * Un utilisateur peut effectuer :
 *
 * ✓ 100 requêtes
 *
 * mais la 101ème sera refusée.
 */
export const globalRateLimiter = rateLimit({
  /**
   * Fenêtre de temps.
   *
   * 15 minutes exprimées en millisecondes.
   */
  windowMs: 15 * 60 * 1000,

  /**
   * Nombre maximal de requêtes autorisées
   * durant cette période.
   */
  max: 100,

  /**
   * Désactivation pendant les tests.
   */
  skip: skipInTest,

  /**
   * Utilisation des nouveaux headers
   * normalisés RFC.
   */
  standardHeaders: true,

  /**
   * Désactivation des anciens headers.
   */
  legacyHeaders: false,

  /**
   * Réponse envoyée lorsque
   * la limite est dépassée.
   */
  message: {
    error: "Trop de requêtes, veuillez réessayer plus tard.",
  },
});

/**
 * ==========================================================
 * RATE LIMITER D'AUTHENTIFICATION
 * ==========================================================
 *
 * Ce limiteur protège spécifiquement
 * les routes sensibles :
 *
 * - connexion
 * - authentification
 * - éventuellement inscription
 *
 * Il permet de lutter contre :
 *
 * - brute force
 * - credential stuffing
 * - attaques automatisées
 *
 * Limite :
 *
 * 10 tentatives en 15 minutes.
 */
export const authRateLimiter = rateLimit({
  /**
   * Fenêtre temporelle.
   *
   * 15 minutes.
   */
  windowMs: 15 * 60 * 1000,

  /**
   * Seulement 10 tentatives.
   */
  max: 10,

  /**
   * Désactivé pendant les tests.
   */
  skip: skipInTest,

  /**
   * Headers standardisés.
   */
  standardHeaders: true,

  /**
   * Suppression des anciens headers.
   */
  legacyHeaders: false,

  /**
   * Message renvoyé lorsque
   * le seuil est atteint.
   */
  message: {
    error: "Trop de tentatives de connexion, veuillez réessayer plus tard.",
  },
});
