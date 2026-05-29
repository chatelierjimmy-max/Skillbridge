export type UserRole = "USER" | "ADMIN";

export interface AuthUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
}
