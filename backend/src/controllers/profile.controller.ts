/**
 * ==========================================================
 * CONTRÔLEUR DU PROFIL UTILISATEUR
 * ==========================================================
 *
 * Ce contrôleur gère les opérations liées au profil
 * personnel de l'utilisateur connecté.
 *
 * Fonctionnalités :
 * - consulter son profil
 * - modifier son profil
 *
 * Le profil contient notamment :
 * - la biographie
 * - le niveau de compétence
 * - les disponibilités
 * - la localisation
 *
 * Architecture :
 *
 * Frontend React
 *       │
 *       ▼
 * ProfileController
 *       │
 *       ▼
 * ProfileService
 *       │
 *       ▼
 * MariaDB (via Prisma)
 */

/**
 * Importation des types Express
 * utilisés pour typer les requêtes HTTP.
 */
import type { Request, Response, NextFunction } from "express";

/**
 * Service contenant la logique métier
 * liée aux profils utilisateurs.
 */
import { profileService } from "../services/profile.service";

/**
 * Objet regroupant toutes les actions
 * liées aux profils.
 */
export const profileController = {
  /**
   * ==========================================================
   * RÉCUPÉRATION DU PROFIL DE L'UTILISATEUR CONNECTÉ
   * ==========================================================
   *
   * Route :
   * GET /users/me/profile
   *
   * Retourne les informations du profil
   * de l'utilisateur authentifié.
   */
  async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Récupération du profil.
       *
       * L'identifiant utilisateur est obtenu
       * grâce au middleware JWT.
       */
      const profile = await profileService.getMyProfile(req.user.id);

      /**
       * Retour du profil au format JSON.
       */
      res.status(200).json(profile);
    } catch (error) {
      /**
       * Transmission de l'erreur
       * au middleware global.
       */
      next(error);
    }
  },

  /**
   * ==========================================================
   * MISE À JOUR DU PROFIL
   * ==========================================================
   *
   * Route :
   * PUT /users/me/profile
   *
   * Permet à l'utilisateur connecté
   * de modifier ses informations personnelles.
   */
  async updateMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * Mise à jour du profil.
       *
       * Paramètres :
       * - identifiant utilisateur
       * - nouvelles données du profil
       */
      const profile = await profileService.updateMyProfile(
        req.user.id,
        req.body,
      );

      /**
       * Retour d'une confirmation
       * ainsi que du profil mis à jour.
       */
      res.status(200).json({
        /**
         * Message de succès.
         */
        message: "Profil mis à jour",

        /**
         * Nouvelle version du profil.
         */
        profile,
      });
    } catch (error) {
      /**
       * Transmission de l'erreur
       * au middleware global.
       */
      next(error);
    }
  },
};
