import { api } from "./api";
import type { Skill, UserSkill } from "../types/skill.type";
import type { Level } from "../types/profile.type";

export const skillService = {
  async getAllSkills() {
    const response = await api.get<Skill[]>("/users/skills");
    return response.data;
  },

  async getMySkills() {
    const response = await api.get<UserSkill[]>("/users/me/skills");
    return response.data;
  },

  async addMySkill(skillId: number, level: Level) {
    const response = await api.post("/users/me/skills", {
      skillId,
      level,
    });

    return response.data;
  },

  async removeMySkill(skillId: number) {
    const response = await api.delete(`/users/me/skills/${skillId}`);
    return response.data;
  },
};
