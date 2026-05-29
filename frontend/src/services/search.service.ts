import { api } from "./api";
import type { LearnerResult, SearchFilters } from "../types/search.type";

export const searchService = {
  async searchLearners(filters: SearchFilters) {
    const response = await api.get<LearnerResult[]>("/users/search", {
      params: {
        skill: filters.skill || undefined,
        level: filters.level || undefined,
        city: filters.city || undefined,
      },
    });

    return response.data;
  },
};
