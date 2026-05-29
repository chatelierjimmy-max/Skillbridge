import { UserStatus } from "@prisma/client";
import type { Level, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

interface SearchLearnersFilters {
  userId: number;
  skill?: string;
  level?: Level;
  city?: string;
  page?: number;
  limit?: number;
}

const learnerSelect = {
  id: true,
  firstname: true,
  lastname: true,
  profile: {
    select: {
      bio: true,
      level: true,
      availability: true,
      location: true,
    },
  },
  skills: {
    select: {
      level: true,
      skill: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
  },
} satisfies Prisma.UserSelect;

export type SearchLearner = Prisma.UserGetPayload<{
  select: typeof learnerSelect;
}>;

export const searchRepository = {
  searchLearners(filters: SearchLearnersFilters): Promise<SearchLearner[]> {
    const where: Prisma.UserWhereInput = {
      id: {
        not: filters.userId,
      },
      status: UserStatus.ACTIVE,
    };

    const profileWhere: Prisma.ProfileWhereInput = {};

    if (filters.level) {
      profileWhere.level = filters.level;
    }

    if (filters.city) {
      profileWhere.location = {
        contains: filters.city,
      };
    }

    if (Object.keys(profileWhere).length > 0) {
      where.profile = {
        is: profileWhere,
      };
    }

    const userSkillWhere: Prisma.UserSkillWhereInput = {};

    if (filters.level) {
      userSkillWhere.level = filters.level;
    }

    if (filters.skill) {
      userSkillWhere.skill = {
        name: {
          contains: filters.skill,
        },
      };
    }

    const shouldFilterSkills = Object.keys(userSkillWhere).length > 0;

    if (shouldFilterSkills) {
      where.skills = {
        some: userSkillWhere,
      };
    }

    const shouldPaginate = filters.page !== undefined || filters.limit !== undefined;
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;

    return prisma.user.findMany({
      where,
      select: {
        ...learnerSelect,
        skills: {
          ...(shouldFilterSkills ? { where: userSkillWhere } : {}),
          select: learnerSelect.skills.select,
        },
      },
      orderBy: {
        firstname: "asc",
      },
      ...(shouldPaginate
        ? {
            skip: (page - 1) * limit,
            take: limit,
          }
        : {}),
    });
  },
};
