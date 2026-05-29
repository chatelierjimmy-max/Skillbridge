import { prisma } from "../config/prisma";
import { Level } from "@prisma/client";

export const skillRepository = {
  findAll() {
    return prisma.skill.findMany({
      orderBy: {
        name: "asc",
      },
    });
  },

  findById(id: number) {
    return prisma.skill.findUnique({
      where: { id },
    });
  },

  addUserSkill(userId: number, skillId: number, level: Level) {
    return prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
      update: {
        level,
      },
      create: {
        userId,
        skillId,
        level,
      },
    });
  },

  removeUserSkill(userId: number, skillId: number) {
    return prisma.userSkill.delete({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
    });
  },

  findUserSkills(userId: number) {
    return prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: true,
      },
      orderBy: {
        skill: {
          name: "asc",
        },
      },
    });
  },
};
