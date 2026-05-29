import bcrypt from "bcrypt";
import { UserStatus } from "@prisma/client";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { generateToken } from "../utils/jwt";
import { logService } from "./log.service";
interface RegisterInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface RequestContext {
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}

export const authService = {
  async register(data: RegisterInput, context?: RequestContext) {
  const existingUser = await userRepository.findByEmail(data.email);

  if (existingUser) {
    throw new AppError("Cet email est déjà utilisé", 409);
  }

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  const user = await userRepository.create({
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email.toLowerCase(),
    password: hashedPassword,
  });

  await logService.activity("REGISTER", {
    userId: user.id,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  });

  return user;
},

  async login(data: LoginInput, context?: RequestContext) {
  const user = await userRepository.findByEmail(data.email.toLowerCase());

  if (!user) {
    await logService.security(
      "LOGIN_FAILED",
      {
        email: data.email,
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      },
      "USER_NOT_FOUND"
    );

    throw new AppError("Identifiants incorrects", 401);
  }

  if (user.status === UserStatus.DISABLED) {
    await logService.security(
      "ACCOUNT_DISABLED",
      {
        userId: user.id,
        email: user.email,
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      },
      "DISABLED_ACCOUNT_LOGIN_ATTEMPT"
    );

    throw new AppError("Compte désactivé", 403);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    await logService.security(
      "LOGIN_FAILED",
      {
        userId: user.id,
        email: user.email,
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      },
      "INVALID_PASSWORD"
    );

    throw new AppError("Identifiants incorrects", 401);
  }

  await logService.security("LOGIN_SUCCESS", {
    userId: user.id,
    email: user.email,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  });

  await logService.activity("LOGIN", {
    userId: user.id,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  });

  const accessToken = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    },
    accessToken,
  };
},

  async me(userId: number) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("Utilisateur introuvable", 404);
    }

    return user;
  },
};
