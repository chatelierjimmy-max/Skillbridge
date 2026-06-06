// Import du rôle d'un membre dans un groupe.
// GroupRole est une enum générée par Prisma.
import { GroupRole } from "@prisma/client";

// Import du type Level généré par Prisma.
// "import type" indique que Level est utilisé uniquement pour le typage TypeScript.
import type { Level } from "@prisma/client";

// Import de l'instance Prisma configurée.
// Elle permet d'interagir avec la base de données.
import { prisma } from "../config/prisma";

/**
 * Interface décrivant les données nécessaires
 * pour créer un nouveau groupe.
 */
interface CreateGroupData {
  // Nom du groupe
  name: string;

  // Description optionnelle du groupe
  description?: string;

  // Niveau associé au groupe
  level: Level;

  // Identifiant de l'utilisateur créateur du groupe
  ownerId: number;

  // Identifiant de la compétence associée au groupe
  skillId: number;
}

/**
 * Repository dédié à la gestion des groupes.
 * Il centralise toutes les requêtes Prisma liées aux groupes
 * et aux membres de groupes.
 */
export const groupRepository = {
  /**
   * Récupère tous les groupes.
   *
   * Inclut :
   * - la compétence liée au groupe
   * - le propriétaire du groupe
   * - les membres du groupe
   *
   * Les groupes sont triés du plus récent au plus ancien.
   */
  findAll() {
    return prisma.group.findMany({
      include: {
        skill: true,

        owner: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },

        members: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Recherche un groupe par son identifiant.
   *
   * Retourne le groupe avec :
   * - sa compétence
   * - son propriétaire
   * - ses membres
   * - les informations principales de chaque membre
   *
   * @param id - Identifiant du groupe recherché
   */
  findById(id: number) {
    return prisma.group.findUnique({
      where: { id },

      include: {
        skill: true,

        owner: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },

        members: {
          include: {
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        },
      },
    });
  },

  /**
   * Crée un nouveau groupe.
   *
   * La création est faite dans une transaction :
   * 1. Création du groupe
   * 2. Ajout automatique du créateur comme membre OWNER
   *
   * Si une des deux opérations échoue,
   * toute la transaction est annulée.
   *
   * @param data - Données nécessaires à la création du groupe
   */
  create(data: CreateGroupData) {
    return prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          name: data.name,

          // Ajoute la description uniquement si elle est définie.
          // Cela évite d'envoyer explicitement undefined à Prisma.
          ...(data.description !== undefined
            ? { description: data.description }
            : {}),

          level: data.level,
          ownerId: data.ownerId,
          skillId: data.skillId,
        },
      });

      // Ajoute automatiquement le créateur du groupe
      // comme membre avec le rôle OWNER.
      await tx.groupMember.create({
        data: {
          userId: data.ownerId,
          groupId: group.id,
          role: GroupRole.OWNER,
        },
      });

      return group;
    });
  },

  /**
   * Recherche l'appartenance d'un utilisateur à un groupe.
   *
   * Utilise une clé unique composée :
   * - userId
   * - groupId
   *
   * Cela permet de vérifier si un utilisateur est déjà membre
   * d'un groupe donné.
   *
   * @param userId - Identifiant de l'utilisateur
   * @param groupId - Identifiant du groupe
   */
  findMembership(userId: number, groupId: number) {
    return prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });
  },

  /**
   * Récupère tous les groupes auxquels appartient un utilisateur.
   *
   * Retourne les entrées groupMember avec le groupe associé,
   * sa compétence et ses membres.
   *
   * @param userId - Identifiant de l'utilisateur
   */
  findUserGroups(userId: number) {
    return prisma.groupMember.findMany({
      where: { userId },

      include: {
        group: {
          include: {
            skill: true,
            members: true,
          },
        },
      },
    });
  },

  /**
   * Ajoute un utilisateur dans un groupe.
   *
   * L'utilisateur est ajouté avec le rôle MEMBER.
   *
   * @param userId - Identifiant de l'utilisateur qui rejoint le groupe
   * @param groupId - Identifiant du groupe rejoint
   */
  join(userId: number, groupId: number) {
    return prisma.groupMember.create({
      data: {
        userId,
        groupId,
        role: GroupRole.MEMBER,
      },
    });
  },

  /**
   * Retire un utilisateur d'un groupe.
   *
   * Supprime l'entrée correspondante dans la table groupMember.
   *
   * @param userId - Identifiant de l'utilisateur
   * @param groupId - Identifiant du groupe quitté
   */
  leave(userId: number, groupId: number) {
    return prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });
  },

  /**
   * Compte le nombre de membres dans un groupe.
   *
   * @param groupId - Identifiant du groupe
   * @returns Le nombre total de membres du groupe
   */
  countMembers(groupId: number) {
    return prisma.groupMember.count({
      where: { groupId },
    });
  },
};
