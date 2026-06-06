// Import de l'instance Prisma permettant d'interagir
// avec la base de données relationnelle.
import { prisma } from "../config/prisma";

// Import de l'enum Level générée automatiquement par Prisma.
// Elle représente les différents niveaux de compétence
// qu'un utilisateur peut posséder pour une skill.
import { Level } from "@prisma/client";

/**
 * Repository chargé de gérer :
 * - les compétences disponibles dans l'application
 * - les associations entre utilisateurs et compétences
 *
 * Il centralise toutes les opérations CRUD
 * liées aux skills.
 */
export const skillRepository = {
  /**
   * Récupère l'ensemble des compétences disponibles.
   *
   * Les résultats sont triés alphabétiquement
   * afin de faciliter leur affichage dans l'interface.
   *
   * @returns Liste des compétences
   */
  findAll() {
    return prisma.skill.findMany({
      orderBy: {
        name: "asc",
      },
    });
  },

  /**
   * Recherche une compétence à partir de son identifiant.
   *
   * @param id Identifiant de la compétence
   * @returns La compétence trouvée ou null
   */
  findById(id: number) {
    return prisma.skill.findUnique({
      where: {
        id,
      },
    });
  },

  /**
   * Ajoute ou met à jour une compétence
   * associée à un utilisateur.
   *
   * Utilisation de "upsert" :
   *
   * - si la relation utilisateur/compétence existe déjà,
   *   seul le niveau est mis à jour ;
   *
   * - sinon une nouvelle association est créée.
   *
   * Cela évite d'effectuer une recherche préalable.
   *
   * @param userId Identifiant de l'utilisateur
   * @param skillId Identifiant de la compétence
   * @param level Niveau associé à la compétence
   */
  addUserSkill(userId: number, skillId: number, level: Level) {
    return prisma.userSkill.upsert({
      /**
       * Clé composite unique :
       * (userId, skillId)
       *
       * Un utilisateur ne peut posséder
       * qu'une seule entrée par compétence.
       */
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },

      /**
       * Cas où la compétence existe déjà :
       * mise à jour du niveau.
       */
      update: {
        level,
      },

      /**
       * Cas où la compétence n'existe pas :
       * création d'une nouvelle relation.
       */
      create: {
        userId,
        skillId,
        level,
      },
    });
  },

  /**
   * Supprime une compétence associée à un utilisateur.
   *
   * La suppression concerne uniquement
   * la relation UserSkill.
   *
   * La compétence elle-même reste présente
   * dans la table Skill.
   *
   * @param userId Identifiant de l'utilisateur
   * @param skillId Identifiant de la compétence
   */
  removeUserSkill(userId: number, skillId: number) {
    return prisma.userSkill.delete({
      /**
       * Suppression basée sur la clé composite.
       */
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
    });
  },

  /**
   * Récupère toutes les compétences
   * associées à un utilisateur.
   *
   * Inclut également les informations
   * complètes de chaque compétence.
   *
   * Les résultats sont triés
   * alphabétiquement par nom de compétence.
   *
   * @param userId Identifiant de l'utilisateur
   * @returns Liste des compétences de l'utilisateur
   */
  findUserSkills(userId: number) {
    return prisma.userSkill.findMany({
      where: {
        userId,
      },

      /**
       * Chargement des informations
       * de la compétence associée.
       */
      include: {
        skill: true,
      },

      /**
       * Tri alphabétique sur le nom
       * de la compétence.
       */
      orderBy: {
        skill: {
          name: "asc",
        },
      },
    });
  },
};
