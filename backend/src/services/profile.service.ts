import { Level } from "@prisma/client";
import { profileRepository } from "../repositories/profile.repository";
import { AppError } from "../utils/AppError";

interface UpdateProfileInput {
  bio?: string;
  level?: Level;
  availability?: string;
  location?: string;
}

export const profileService = {
  async getMyProfile(userId: number) {
    const profile = await profileRepository.findByUserId(userId);

    if (!profile) {
      throw new AppError("Profil introuvable", 404);
    }

    return profile;
  },

  async updateMyProfile(userId: number, data: UpdateProfileInput) {
    return profileRepository.update(userId, data);
  },
};
