import { prisma } from "../config/prisma";
import { Level } from "@prisma/client";

interface UpdateProfileData {
  bio?: string;
  level?: Level;
  availability?: string;
  location?: string;
}

export const profileRepository = {
  findByUserId(userId: number) {
    return prisma.profile.findUnique({
      where: { userId },
    });
  },

  update(userId: number, data: UpdateProfileData) {
    return prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  },
};
