/**
 * ==========================================================
 * CONTRÔLEUR DES GROUPES
 * ==========================================================
 *
 * Ce contrôleur gère toutes les opérations liées
 * aux groupes de travail collaboratifs de SkillBridge.
 *
 * Fonctionnalités :
 * - consulter tous les groupes
 * - consulter un groupe précis
 * - consulter ses propres groupes
 * - créer un groupe
 * - rejoindre un groupe
 * - quitter un groupe
 *
 * Le contrôleur agit comme intermédiaire entre :
 *
 * Frontend React
 *       │
 *       ▼
 * GroupController
 *       │
 *       ▼
 * GroupService
 *       │
 *       ▼
 * Prisma / Base de données
 */

/**
 * Importation des types Express utilisés
 * pour typer les requêtes et réponses HTTP.
 */
import type { Request, Response, NextFunction } from "express";

/**
 * Service métier contenant toute la logique
 * de gestion des groupes.
 */
import { groupService } from "../services/group.service";

/**
 * Objet regroupant toutes les actions
 * liées aux groupes.
 */
export const groupController = {
  /**
   * ==========================================================
   * RÉCUPÉRATION DE TOUS LES GROUPES
   * ==========================================================
   *
   * Route :
   * GET /groups
   *
   * Retourne l'ensemble des groupes disponibles
   * sur la plateforme.
   */
  async getAllGroups(_req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Chargement des groupes depuis le service.
       */
      const groups = await groupService.getAllGroups();

      /**
       * Réponse HTTP 200.
       */
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * RÉCUPÉRATION D'UN GROUPE PAR SON ID
   * ==========================================================
   *
   * Route :
   * GET /groups/:id
   *
   * Retourne les informations détaillées
   * d'un groupe spécifique.
   */
  async getGroupById(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Conversion de l'identifiant reçu
       * dans l'URL en nombre.
       *
       * Exemple :
       *
       * /groups/12
       *
       * devient :
       *
       * 12
       */
      const group = await groupService.getGroupById(Number(req.params.id));

      /**
       * Retour du groupe.
       */
      res.status(200).json(group);
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * RÉCUPÉRATION DES GROUPES DE L'UTILISATEUR
   * ==========================================================
   *
   * Route :
   * GET /groups/me
   *
   * Retourne uniquement les groupes
   * auxquels l'utilisateur connecté appartient.
   */
  async getMyGroups(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Utilisation de l'identifiant extrait
       * du token JWT.
       */
      const groups = await groupService.getMyGroups(req.user.id);

      /**
       * Réponse HTTP.
       */
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * CRÉATION D'UN GROUPE
   * ==========================================================
   *
   * Route :
   * POST /groups
   *
   * Permet à un utilisateur de créer
   * un nouveau groupe d'apprentissage.
   */
  async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Création du groupe.
       *
       * Paramètres :
       *
       * - utilisateur créateur
       * - données du formulaire
       */
      const group = await groupService.createGroup(req.user.id, req.body);

      /**
       * Réponse HTTP 201.
       *
       * 201 = ressource créée.
       */
      res.status(201).json({
        /**
         * Message de confirmation.
         */
        message: "Groupe créé",

        /**
         * Identifiant du nouveau groupe.
         */
        groupId: group.id,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * REJOINDRE UN GROUPE
   * ==========================================================
   *
   * Route :
   * POST /groups/:id/join
   *
   * Ajoute l'utilisateur connecté
   * dans la liste des membres du groupe.
   */
  async joinGroup(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Ajout du membre au groupe.
       */
      const result = await groupService.joinGroup(
        req.user.id,
        Number(req.params.id),
      );

      /**
       * Retour du résultat.
       */
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * ==========================================================
   * QUITTER UN GROUPE
   * ==========================================================
   *
   * Route :
   * DELETE /groups/:id/leave
   *
   * Retire l'utilisateur connecté
   * de la liste des membres.
   */
  async leaveGroup(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Suppression du membre du groupe.
       */
      const result = await groupService.leaveGroup(
        req.user.id,
        Number(req.params.id),
      );

      /**
       * Retour du résultat.
       */
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
