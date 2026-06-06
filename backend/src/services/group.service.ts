// Import de l'enum GroupRole générée par Prisma.
// Elle permet notamment d'identifier les rôles OWNER et MEMBER.
import { GroupRole } from "@prisma/client";

// Import du type Level utilisé pour le niveau du groupe.
import type { Level } from "@prisma/client";

// Repository des groupes.
// Il contient toutes les opérations d'accès aux données des groupes.
import { groupRepository } from "../repositories/group.repository";

// Repository des compétences.
// Utilisé pour vérifier qu'une compétence existe avant de créer un groupe.
import { skillRepository } from "../repositories/skill.repository";

// Classe d'erreur personnalisée.
import { AppError } from "../utils/AppError";

// Service de notifications.
import { notificationService } from "./notification.service";

// Service de journalisation.
import { logService } from "./log.service";

/**
 * Données nécessaires à la création d'un groupe.
 */
interface CreateGroupInput {
  name: string;
  description?: string;
  level: Level;
  skillId: number;
}

/**
 * Service métier de gestion des groupes.
 *
 * Responsable de :
 * - consulter les groupes
 * - consulter un groupe précis
 * - récupérer les groupes d'un utilisateur
 * - créer un groupe
 * - rejoindre un groupe
 * - quitter un groupe
 */
export const groupService = {
  /**
   * Retourne tous les groupes disponibles.
   *
   * Transforme les données pour exposer
   * un nombre de membres plutôt que la liste complète.
   */
  async getAllGroups() {
    const groups = await groupRepository.findAll();

    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      level: group.level,
      skill: group.skill,
      owner: group.owner,

      // Nombre total de membres du groupe.
      membersCount: group.members.length,

      createdAt: group.createdAt,
    }));
  },

  /**
   * Retourne les détails complets d'un groupe.
   *
   * Inclut :
   * - informations du groupe
   * - propriétaire
   * - liste des membres
   */
  async getGroupById(groupId: number) {
    const group = await groupRepository.findById(groupId);

    if (!group) {
      throw new AppError("Groupe introuvable", 404);
    }

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      level: group.level,
      skill: group.skill,
      owner: group.owner,

      // Transformation des membres afin d'exposer
      // uniquement les informations utiles.
      members: group.members.map((member) => ({
        id: member.user.id,
        firstname: member.user.firstname,
        lastname: member.user.lastname,
        email: member.user.email,
        role: member.role,
        joinedAt: member.joinedAt,
      })),

      createdAt: group.createdAt,
    };
  },

  /**
   * Retourne les groupes auxquels
   * appartient l'utilisateur connecté.
   */
  async getMyGroups(userId: number) {
    const memberships = await groupRepository.findUserGroups(userId);

    return memberships.map((membership) => ({
      id: membership.group.id,
      name: membership.group.name,
      description: membership.group.description,
      level: membership.group.level,
      skill: membership.group.skill,

      // Nombre de membres dans le groupe.
      membersCount: membership.group.members.length,

      // Rôle de l'utilisateur dans ce groupe.
      role: membership.role,
    }));
  },

  /**
   * Crée un nouveau groupe.
   *
   * Vérifie au préalable que la compétence
   * associée existe dans la base.
   */
  async createGroup(userId: number, data: CreateGroupInput) {
    const skill = await skillRepository.findById(data.skillId);

    if (!skill) {
      throw new AppError("Compétence introuvable", 404);
    }

    return groupRepository.create({
      name: data.name,

      // Ajoute la description uniquement si elle existe.
      ...(data.description !== undefined
        ? { description: data.description }
        : {}),

      level: data.level,
      skillId: data.skillId,

      // Le créateur devient automatiquement propriétaire.
      ownerId: userId,
    });
  },

  /**
   * Ajoute un utilisateur dans un groupe.
   *
   * Étapes :
   * 1. Vérifier que le groupe existe
   * 2. Vérifier que l'utilisateur n'est pas déjà membre
   * 3. Ajouter l'utilisateur
   * 4. Créer une notification
   * 5. Journaliser l'action
   */
  async joinGroup(userId: number, groupId: number) {
    const group = await groupRepository.findById(groupId);

    if (!group) {
      throw new AppError("Groupe introuvable", 404);
    }

    const existingMembership = await groupRepository.findMembership(
      userId,
      groupId,
    );

    if (existingMembership) {
      throw new AppError("Vous êtes déjà membre de ce groupe", 409);
    }

    // Création de l'adhésion.
    await groupRepository.join(userId, groupId);

    // Notification utilisateur.
    await notificationService.createNotification({
      userId,
      type: "GROUP_JOINED",
      title: "Groupe rejoint",
      content: `Vous avez rejoint le groupe ${group.name}.`,
    });

    // Journalisation de l'action.
    await logService.activity("JOIN_GROUP", { userId }, "GROUP", groupId);

    return {
      message: "Vous avez rejoint le groupe",
    };
  },

  /**
   * Permet à un utilisateur de quitter un groupe.
   *
   * Étapes :
   * 1. Vérifier que le groupe existe
   * 2. Vérifier que l'utilisateur est membre
   * 3. Empêcher le propriétaire de quitter son groupe
   * 4. Supprimer l'adhésion
   */
  async leaveGroup(userId: number, groupId: number) {
    const group = await groupRepository.findById(groupId);

    if (!group) {
      throw new AppError("Groupe introuvable", 404);
    }

    const membership = await groupRepository.findMembership(userId, groupId);

    if (!membership) {
      throw new AppError("Vous n'êtes pas membre de ce groupe", 404);
    }

    // Règle métier :
    // le créateur du groupe ne peut pas quitter
    // son propre groupe sans le transférer ou le supprimer.
    if (membership.role === GroupRole.OWNER) {
      throw new AppError(
        "Le propriétaire ne peut pas quitter son propre groupe",
        403,
      );
    }

    // Suppression de l'adhésion.
    await groupRepository.leave(userId, groupId);

    return {
      message: "Vous avez quitté le groupe",
    };
  },
};
