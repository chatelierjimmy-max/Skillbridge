import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import type { UserRole } from "@prisma/client";
import { env } from "../config/env";

export interface JwtPayload {
  userId: number;
  role: UserRole;
}

export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as StringValue,
  };

  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};
