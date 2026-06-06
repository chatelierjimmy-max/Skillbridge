/**
 * ==========================================================
 * CONTRÔLEUR DE RECHERCHE D'APPRENANTS
 * ==========================================================
 *
 * Ce contrôleur gère la recherche d'utilisateurs
 * sur la plateforme SkillBridge.
 *
 * Il permet de filtrer les apprenants selon :
 * - une compétence
 * - un niveau
 * - une ville
 * - une pagination
 *
 * L'objectif est de faciliter la mise en relation
 * entre apprenants ayant des intérêts ou des
 * compétences similaires.
 *
 * Architecture :
 *
 * Frontend React
 *       │
 *       ▼
 * SearchController
 *       │
 *       ▼
 * SearchService
 *       │
 *       ▼
 * MariaDB (Prisma)
 */

/**
 * Importation des types Express
 * permettant de typer les requêtes HTTP.
 */
import type { Request, Response, NextFunction } from "express";

/**
 * Importation du type Level provenant
 * du schéma Prisma.
 *
 * Valeurs possibles :
 * - BEGINNER
 * - INTERMEDIATE
 * - ADVANCED
 */
import type { Level } from "@prisma/client";

/**
 * Service contenant la logique métier
 * de recherche des apprenants.
 */
import { searchService } from "../services/search.service";

/**
 * Type représentant l'ensemble
 * des filtres acceptés par le moteur
 * de recherche.
 */
import type { SearchLearnersInput } from "../services/search.service";

/**
 * Objet regroupant les actions
 * liées à la recherche.
 */
export const searchController = {
  /**
   * ==========================================================
   * RECHERCHER DES APPRENANTS
   * ==========================================================
   *
   * Route :
   * GET /users/search
   *
   * Paramètres possibles :
   *
   * ?skill=React
   * ?level=BEGINNER
   * ?city=Lyon
   * ?page=1
   * ?limit=10
   *
   * Tous les filtres sont optionnels.
   */
  async searchLearners(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Création de l'objet contenant
       * les filtres de recherche.
       *
       * L'utilisateur connecté est
       * automatiquement ajouté.
       */
      const filters: SearchLearnersInput = {
        /**
         * Utilisateur effectuant
         * la recherche.
         */
        userId: req.user.id,
      };

      /**
       * ======================================================
       * FILTRE PAR COMPÉTENCE
       * ======================================================
       *
       * Exemple :
       *
       * ?skill=React
       */
      if (typeof req.query.skill === "string") {
        filters.skill = req.query.skill;
      }

      /**
       * ======================================================
       * FILTRE PAR NIVEAU
       * ======================================================
       *
       * Exemple :
       *
       * ?level=ADVANCED
       */
      if (typeof req.query.level === "string") {
        filters.level = req.query.level as Level;
      }

      /**
       * ======================================================
       * FILTRE PAR VILLE
       * ======================================================
       *
       * Exemple :
       *
       * ?city=Lyon
       */
      if (typeof req.query.city === "string") {
        filters.city = req.query.city;
      }

      /**
       * ======================================================
       * PAGINATION - PAGE
       * ======================================================
       *
       * Exemple :
       *
       * ?page=2
       *
       * Conversion nécessaire car les
       * paramètres URL sont toujours
       * reçus sous forme de chaîne.
       */
      if (typeof req.query.page === "string") {
        filters.page = Number(req.query.page);
      }

      /**
       * ======================================================
       * PAGINATION - LIMITE
       * ======================================================
       *
       * Exemple :
       *
       * ?limit=20
       */
      if (typeof req.query.limit === "string") {
        filters.limit = Number(req.query.limit);
      }

      /**
       * Exécution de la recherche
       * avec les filtres construits.
       */
      const learners = await searchService.searchLearners(filters);

      /**
       * Retour des résultats.
       */
      res.status(200).json(learners);
    } catch (error) {
      /**
       * Transmission de l'erreur
       * au middleware global.
       */
      next(error);
    }
  },
};
