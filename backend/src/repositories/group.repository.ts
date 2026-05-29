import { GroupRole } from "@prisma/client";
import type { Level } from "@prisma/client";
import { prisma } from "../config/prisma";

interface CreateGroupData {
  name: string;
  description?: string;
  level: Level;
  ownerId: number;
  skillId: number;
}

export const groupRepository = {
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

  create(data: CreateGroupData) {
    return prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          name: data.name,
          ...(data.description !== undefined
            ? { description: data.description }
            : {}),
          level: data.level,
          ownerId: data.ownerId,
          skillId: data.skillId,
        },
      });

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

  join(userId: number, groupId: number) {
    return prisma.groupMember.create({
      data: {
        userId,
        groupId,
        role: GroupRole.MEMBER,
      },
    });
  },

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

  countMembers(groupId: number) {
    return prisma.groupMember.count({
      where: { groupId },
    });
  },
};
