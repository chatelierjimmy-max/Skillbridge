import bcrypt from "bcrypt";
import { UserStatus } from "@prisma/client";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { generateToken } from "../utils/jwt";

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

export const authService = {
  async register(data: RegisterInput) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("Cet email est déjà utilisé", 409);
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    return userRepository.create({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email.toLowerCase(),
      password: hashedPassword,
    });
  },

  async login(data: LoginInput) {
    const user = await userRepository.findByEmail(data.email.toLowerCase());

    if (!user) {
      throw new AppError("Identifiants incorrects", 401);
    }

    if (user.status === UserStatus.DISABLED) {
      throw new AppError("Compte désactivé", 403);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Identifiants incorrects", 401);
    }

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
