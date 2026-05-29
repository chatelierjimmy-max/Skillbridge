import { GroupRole } from "@prisma/client";
import type { Level } from "@prisma/client";
import { groupRepository } from "../repositories/group.repository";
import { skillRepository } from "../repositories/skill.repository";
import { AppError } from "../utils/AppError";
import { notificationService } from "./notification.service";
import { logService } from "./log.service";

interface CreateGroupInput {
  name: string;
  description?: string;
  level: Level;
  skillId: number;
}

export const groupService = {
  async getAllGroups() {
    const groups = await groupRepository.findAll();

    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      level: group.level,
      skill: group.skill,
      owner: group.owner,
      membersCount: group.members.length,
      createdAt: group.createdAt,
    }));
  },

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

  async createGroup(userId: number, data: CreateGroupInput) {
    const skill = await skillRepository.findById(data.skillId);

    if (!skill) {
      throw new AppError("Compétence introuvable", 404);
    }

    return groupRepository.create({
      name: data.name,
      ...(data.description !== undefined ? { description: data.description } : {}),
      level: data.level,
      skillId: data.skillId,
      ownerId: userId,
    });
  },

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

    await groupRepository.join(userId, groupId);

    await notificationService.createNotification({
      userId,
      type: "GROUP_JOINED",
      title: "Groupe rejoint",
      content: `Vous avez rejoint le groupe ${group.name}.`,
    });

    await logService.activity("JOIN_GROUP", { userId }, "GROUP", groupId);

    return {
      message: "Vous avez rejoint le groupe",
    };
  },

  async leaveGroup(userId: number, groupId: number) {
    const group = await groupRepository.findById(groupId);

    if (!group) {
      throw new AppError("Groupe introuvable", 404);
    }

    const membership = await groupRepository.findMembership(userId, groupId);

    if (!membership) {
      throw new AppError("Vous n'êtes pas membre de ce groupe", 404);
    }

    if (membership.role === GroupRole.OWNER) {
      throw new AppError(
        "Le propriétaire ne peut pas quitter son propre groupe",
        403,
      );
    }

    await groupRepository.leave(userId, groupId);

    return {
      message: "Vous avez quitté le groupe",
    };
  },
};
