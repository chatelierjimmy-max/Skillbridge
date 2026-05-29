import type { Level } from "@prisma/client";
import { searchRepository } from "../repositories/search.repository";

export interface SearchLearnersInput {
  userId: number;
  skill?: string;
  level?: Level;
  city?: string;
  page?: number;
  limit?: number;
}

export const searchService = {
  async searchLearners(filters: SearchLearnersInput) {
    const learners = await searchRepository.searchLearners(filters);

    return learners.map((learner) => ({
      id: learner.id,
      firstname: learner.firstname,
      lastname: learner.lastname,
      profile: learner.profile,
      skills: learner.skills.map((userSkill) => ({
        id: userSkill.skill.id,
        name: userSkill.skill.name,
        category: userSkill.skill.category,
        level: userSkill.level,
      })),
    }));
  },
};
