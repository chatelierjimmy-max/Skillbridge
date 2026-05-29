import { api } from "./api";
import type { AuthUser } from "../types/auth.type";

interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}

export const authService = {
  async register(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) {
    const response = await api.post("/auth/register", data);

    return response.data;
  },

  async login(data: { email: string; password: string }) {
    const response = await api.post<LoginResponse>("/auth/login", data);

    return response.data;
  },

  async me() {
    const response = await api.get<AuthUser>("/auth/me");

    return response.data;
  },
};
