export type UserStatus = "ACTIVE" | "DISABLED";
export type UserRole = "USER" | "ADMIN";

export interface AdminUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  profile?: {
    level?: string;
    location?: string;
  };
}

export interface ActivityLog {
  _id: string;
  userId?: number;
  action: string;
  targetType?: string;
  targetId?: string | number;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface SecurityLog {
  _id: string;
  userId?: number;
  email?: string;
  event: string;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
