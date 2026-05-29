import { Level } from "@prisma/client";
import { skillRepository } from "../repositories/skill.repository";
import { AppError } from "../utils/AppError";

export const skillService = {
  async getAllSkills() {
    return skillRepository.findAll();
  },

  async getMySkills(userId: number) {
    const userSkills = await skillRepository.findUserSkills(userId);

    return userSkills.map((userSkill) => ({
      id: userSkill.skill.id,
      name: userSkill.skill.name,
      category: userSkill.skill.category,
      level: userSkill.level,
    }));
  },

  async addMySkill(userId: number, skillId: number, level: Level) {
    const skill = await skillRepository.findById(skillId);

    if (!skill) {
      throw new AppError("Compétence introuvable", 404);
    }

    return skillRepository.addUserSkill(userId, skillId, level);
  },

  async removeMySkill(userId: number, skillId: number) {
    const skill = await skillRepository.findById(skillId);

    if (!skill) {
      throw new AppError("Compétence introuvable", 404);
    }

    try {
      await skillRepository.removeUserSkill(userId, skillId);
    } catch {
      throw new AppError(
        "Cette compétence n'est pas associée à votre profil",
        404,
      );
    }
  },
};
