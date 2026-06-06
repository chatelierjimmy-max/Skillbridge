/**
 * ==========================================================
 * MIDDLEWARE DE VALIDATION DES DONNÉES (ZOD)
 * ==========================================================
 *
 * Ce middleware permet de valider automatiquement
 * les données reçues par l'API avant qu'elles
 * n'atteignent les contrôleurs.
 *
 * Il utilise la bibliothèque Zod pour :
 * - vérifier la structure des données
 * - vérifier les types
 * - appliquer des règles métier
 * - bloquer les requêtes invalides
 *
 * Exemple :
 *
 * - email valide
 * - mot de passe suffisamment long
 * - identifiant numérique
 * - paramètres obligatoires
 *
 * Architecture :
 *
 * Client
 *    │
 *    ▼
 * Requête HTTP
 *    │
 *    ▼
 * validate(schema)
 *    │
 * ┌──┴──┐
 * │     │
 * OK  Erreur
 * │     │
 * ▼     ▼
 * Route 400
 * Controller
 */

import type { Request, Response, NextFunction } from "express";

import type { ZodSchema } from "zod";

import { AppError } from "../utils/AppError";

/**
 * ==========================================================
 * FACTORY DE MIDDLEWARE
 * ==========================================================
 *
 * Cette fonction reçoit un schéma Zod
 * et retourne un middleware Express.
 *
 * Exemple :
 *
 * validate(registerSchema)
 */
export const validate =
  (schema: ZodSchema) =>
  /**
   * Middleware exécuté avant
   * le contrôleur.
   */
  (req: Request, _res: Response, next: NextFunction): void => {
    /**
     * Validation complète
     * de la requête.
     *
     * On transmet :
     *
     * - body
     * - params
     * - query
     *
     * afin que le schéma puisse
     * contrôler toutes les données
     * reçues par l'API.
     */
    const result = schema.safeParse({
      /**
       * Corps de la requête.
       */
      body: req.body,

      /**
       * Paramètres de route.
       *
       * Exemple :
       * /groups/:id
       */
      params: req.params,

      /**
       * Paramètres d'URL.
       *
       * Exemple :
       * ?page=2
       */
      query: req.query,
    });

    /**
     * Vérification du résultat
     * de validation.
     */
    if (!result.success) {
      /**
       * Construction d'un message
       * regroupant toutes les erreurs.
       *
       * Exemple :
       *
       * "Email invalide,
       * Mot de passe trop court"
       */
      const message = result.error.issues

        /**
         * Extraction des messages.
         */
        .map((issue) => issue.message)

        /**
         * Fusion dans une seule chaîne.
         */
        .join(", ");

      /**
       * Retour d'une erreur HTTP 400.
       *
       * 400 = Bad Request
       */
      next(new AppError(message, 400));

      return;
    }

    /**
     * Validation réussie.
     *
     * La requête continue
     * son exécution.
     */
    next();
  };
