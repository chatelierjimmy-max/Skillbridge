// Import du type UserRole généré par Prisma.
//
// Il représente les rôles disponibles dans l'application.
// Exemple :
// - USER
// - ADMIN
import type { UserRole } from "@prisma/client";

/**
 * ====================================
 * Extension globale des types Express
 * ====================================
 *
 * Ce fichier permet d'ajouter des propriétés
 * personnalisées à l'objet Request d'Express.
 *
 * Grâce à cette déclaration, TypeScript connaît
 * automatiquement la propriété req.user
 * dans toute l'application.
 */
declare global {
  namespace Express {
    /**
     * Extension de l'interface Request.
     *
     * Par défaut, Express ne possède pas
     * de propriété "user".
     *
     * Cette déclaration permet d'ajouter
     * les informations utilisateur injectées
     * par le middleware d'authentification.
     */
    interface Request {
      /**
       * Informations de l'utilisateur authentifié.
       *
       * Cette propriété est généralement ajoutée
       * après la validation du JWT.
       *
       * Exemple :
       *
       * req.user = {
       *   id: 12,
       *   role: "USER"
       * };
       */
      user: {
        /**
         * Identifiant unique de l'utilisateur.
         */
        id: number;

        /**
         * Rôle de l'utilisateur connecté.
         *
         * Utilisé notamment pour :
         * - les autorisations
         * - les routes d'administration
         * - les contrôles d'accès
         */
        role: UserRole;
      };
    }
  }
}

/**
 * Export vide obligatoire.
 *
 * Il indique à TypeScript que ce fichier
 * est un module et permet la fusion
 * correcte des déclarations globales.
 */
export {};
