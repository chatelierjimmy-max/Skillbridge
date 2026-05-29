import { prisma } from "../config/prisma";
import { UserStatus } from "@prisma/client";

export const adminRepository = {
  findAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        profile: {
          select: {
            level: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  updateUserStatus(id: number, status: UserStatus) {
    return prisma.user.update({
      where: { id },
      data: { status },
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
