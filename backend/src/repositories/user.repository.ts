// Import de l'instance Prisma permettant d'effectuer
// les opérations sur la base de données.
import { prisma } from "../config/prisma";

// Import des énumérations générées par Prisma.
//
// UserRole : rôle attribué à l'utilisateur
// (USER, ADMIN, etc.)
//
// UserStatus : état du compte utilisateur
// (ACTIVE, SUSPENDED, etc.)
import { UserRole, UserStatus } from "@prisma/client";

/**
 * Interface représentant les données nécessaires
 * à la création d'un nouvel utilisateur.
 */
interface CreateUserData {
  // Prénom de l'utilisateur
  firstname: string;

  // Nom de famille de l'utilisateur
  lastname: string;

  // Adresse email (unique)
  email: string;

  // Mot de passe hashé
  password: string;
}

/**
 * Repository chargé de centraliser
 * toutes les opérations liées aux utilisateurs.
 *
 * Ce repository constitue la couche d'accès
 * aux données de l'entité User.
 */
export const userRepository = {
  /**
   * Recherche un utilisateur à partir de son adresse email.
   *
   * Cette méthode est principalement utilisée :
   * - lors de la connexion
   * - lors de l'inscription pour vérifier l'unicité
   * - lors des procédures de récupération de compte
   *
   * @param email Adresse email recherchée
   * @returns L'utilisateur correspondant ou null
   */
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  /**
   * Recherche un utilisateur par son identifiant.
   *
   * Seuls certains champs sont retournés
   * afin d'éviter d'exposer des données sensibles
   * comme le mot de passe.
   *
   * @param id Identifiant de l'utilisateur
   * @returns Les informations publiques du compte
   */
  findById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        // Identifiant unique
        id: true,

        // Informations personnelles
        firstname: true,
        lastname: true,

        // Adresse email
        email: true,

        // Rôle utilisateur
        role: true,

        // État du compte
        status: true,

        // Date de création du compte
        createdAt: true,
      },
    });
  },

  /**
   * Crée un nouvel utilisateur.
   *
   * Lors de la création :
   * - le rôle USER est attribué automatiquement ;
   * - le statut ACTIVE est attribué automatiquement ;
   * - un profil vide est créé simultanément.
   *
   * Cette approche garantit qu'un utilisateur
   * dispose toujours d'un profil associé.
   *
   * @param data Données du nouvel utilisateur
   * @returns Les informations publiques du compte créé
   */
  create(data: CreateUserData) {
    return prisma.user.create({
      data: {
        // Informations personnelles
        firstname: data.firstname,
        lastname: data.lastname,

        // Identifiants de connexion
        email: data.email,
        password: data.password,

        /**
         * Valeurs attribuées automatiquement
         * lors de l'inscription.
         */
        role: UserRole.USER,
        status: UserStatus.ACTIVE,

        /**
         * Création automatique du profil.
         *
         * Cette relation permet d'assurer
         * qu'un utilisateur possède toujours
         * un enregistrement Profile associé.
         */
        profile: {
          create: {},
        },
      },

      /**
       * Sélection des données retournées.
       *
       * Le mot de passe n'est volontairement
       * jamais renvoyé après création.
       */
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        status: true,
      },
    });
  },
};
