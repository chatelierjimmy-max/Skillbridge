import { api } from "./api";
import type { Profile } from "../types/profile.type";

export const profileService = {
  async getMyProfile() {
    const response = await api.get<Profile>("/users/me/profile");
    return response.data;
  },

  async updateMyProfile(data: Partial<Profile>) {
    const response = await api.put("/users/me/profile", data);
    return response.data;
  },
};
