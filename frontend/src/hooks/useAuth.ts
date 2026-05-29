import type { AuthUser } from "../types/auth.type";

export const useAuth = () => {
  const token = localStorage.getItem("accessToken");

  const userRaw = localStorage.getItem("user");

  const user: AuthUser | null = userRaw ? JSON.parse(userRaw) : null;

  const isAuthenticated = Boolean(token);

  const isAdmin = user?.role === "ADMIN";

  const login = (accessToken: string, user: AuthUser) => {
    localStorage.setItem("accessToken", accessToken);

    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };
};
