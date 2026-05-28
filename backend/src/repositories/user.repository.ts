import { prisma } from "../config/prisma";
import { UserRole, UserStatus } from "@prisma/client";

interface CreateUserData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  },

  create(data: CreateUserData) {
    return prisma.user.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        profile: {
          create: {},
        },
      },
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
