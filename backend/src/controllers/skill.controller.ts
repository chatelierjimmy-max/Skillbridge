/**
 * ==========================================================
 * CONTRÔLEUR DES COMPÉTENCES
 * ==========================================================
 *
 * Ce contrôleur gère toutes les opérations liées
 * aux compétences des utilisateurs dans SkillBridge.
 *
 * Fonctionnalités :
 * - consulter toutes les compétences disponibles
 * - consulter ses propres compétences
 * - ajouter une compétence à son profil
 * - supprimer une compétence de son profil
 *
 * Les compétences constituent un élément central
 * de la plateforme puisqu'elles permettent :
 * - la recherche d'apprenants
 * - la création de groupes
 * - l'organisation de sessions
 *
 * Architecture :
 *
 * Frontend React
 *       │
 *       ▼
 * SkillController
 *       │
 *       ▼
 * SkillService
 *       │
 *       ▼
 * MariaDB (Prisma)
 */

/**
 * Importation des types Express
 * utilisés pour typer les requêtes HTTP.
 */
import type { Request, Response, NextFunction } from "express";

/**
 * Service contenant la logique métier
 * associée aux compétences.
 */
import { skillService } from "../services/skill.service";

/**
 * Objet regroupant toutes les actions
 * liées aux compétences.
 */
export const skillController = {
  /**
   * ==========================================================
   * RÉCUPÉRER TOUTES LES COMPÉTENCES
   * ==========================================================
   *
   * Route :
   * GET /users/skills
   *
   * Retourne la liste complète des compétences
   * disponibles dans l'application.
   */
  async getAllSkills(_req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Chargement de toutes les compétences.
       */
      const skills = await skillService.getAllSkills();

      /**
       * Retour des données.
       */
      res.status(200).json(skills);
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * RÉCUPÉRER MES COMPÉTENCES
   * ==========================================================
   *
   * Route :
   * GET /users/me/skills
   *
   * Retourne les compétences associées
   * à l'utilisateur connecté.
   */
  async getMySkills(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Chargement des compétences
       * de l'utilisateur authentifié.
       */
      const skills = await skillService.getMySkills(req.user.id);

      /**
       * Retour des compétences.
       */
      res.status(200).json(skills);
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * AJOUTER UNE COMPÉTENCE
   * ==========================================================
   *
   * Route :
   * POST /users/me/skills
   *
   * Permet à un utilisateur d'ajouter
   * une compétence à son profil.
   *
   * Données attendues :
   *
   * {
   *   skillId: 5,
   *   level: "INTERMEDIATE"
   * }
   */
  async addMySkill(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Ajout de la compétence.
       *
       * Paramètres :
       * - utilisateur connecté
       * - identifiant de la compétence
       * - niveau associé
       */
      await skillService.addMySkill(
        req.user.id,
        req.body.skillId,
        req.body.level,
      );

      /**
       * Retour HTTP 201.
       *
       * Une nouvelle relation utilisateur /
       * compétence vient d'être créée.
       */
      res.status(201).json({
        /**
         * Message de confirmation.
         */
        message: "Compétence ajoutée",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * SUPPRIMER UNE COMPÉTENCE
   * ==========================================================
   *
   * Route :
   * DELETE /users/me/skills/:skillId
   *
   * Permet de retirer une compétence
   * du profil utilisateur.
   */
  async removeMySkill(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Suppression de la compétence.
       *
       * Paramètres :
       * - utilisateur connecté
       * - identifiant de la compétence
       */
      await skillService.removeMySkill(req.user.id, Number(req.params.skillId));

      /**
       * Confirmation de suppression.
       */
      res.status(200).json({
        /**
         * Message de succès.
         */
        message: "Compétence supprimée",
      });
    } catch (error) {
      next(error);
    }
  },
};
