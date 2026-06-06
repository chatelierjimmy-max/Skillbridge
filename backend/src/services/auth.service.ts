// Import de bcrypt.
// Cette bibliothèque permet de hasher les mots de passe
// et de comparer un mot de passe en clair avec un hash stocké.
import bcrypt from "bcrypt";

// Import de l'enum UserStatus générée par Prisma.
// Elle permet de vérifier l'état du compte utilisateur.
import { UserStatus } from "@prisma/client";

// Repository utilisateur.
// Il centralise les requêtes liées à l'entité User.
import { userRepository } from "../repositories/user.repository";

// Classe d'erreur personnalisée.
// Elle permet de générer des erreurs HTTP contrôlées.
import { AppError } from "../utils/AppError";

// Fonction utilitaire permettant de générer un JWT.
import { generateToken } from "../utils/jwt";

// Service de logs.
// Utilisé pour tracer les actions utilisateur
// et les événements de sécurité.
import { logService } from "./log.service";

/**
 * Données nécessaires à l'inscription.
 */
interface RegisterInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

/**
 * Données nécessaires à la connexion.
 */
interface LoginInput {
  email: string;
  password: string;
}

/**
 * Contexte de la requête HTTP.
 *
 * Ces informations sont optionnelles
 * et servent principalement à la traçabilité.
 */
interface RequestContext {
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}

/**
 * Service d'authentification.
 *
 * Il contient la logique métier liée :
 * - à l'inscription
 * - à la connexion
 * - à la récupération de l'utilisateur connecté
 */
export const authService = {
  /**
   * Inscrit un nouvel utilisateur.
   *
   * Étapes :
   * 1. Vérifier si l'email est déjà utilisé
   * 2. Hasher le mot de passe
   * 3. Créer l'utilisateur en base
   * 4. Enregistrer un log d'activité
   * 5. Retourner l'utilisateur créé
   */
  async register(data: RegisterInput, context?: RequestContext) {
    // Vérifie si un compte existe déjà avec cet email.
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("Cet email est déjà utilisé", 409);
    }

    // Définit le coût de hashage bcrypt.
    // Si la variable d'environnement n'existe pas,
    // la valeur 12 est utilisée par défaut.
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

    // Hashage du mot de passe avant stockage.
    // Le mot de passe en clair ne doit jamais être sauvegardé.
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Création de l'utilisateur avec email normalisé en minuscules.
    const user = await userRepository.create({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email.toLowerCase(),
      password: hashedPassword,
    });

    // Journalise l'inscription de l'utilisateur.
    await logService.activity("REGISTER", {
      userId: user.id,
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
    });

    return user;
  },

  /**
   * Connecte un utilisateur.
   *
   * Étapes :
   * 1. Rechercher l'utilisateur par email
   * 2. Vérifier que le compte existe
   * 3. Vérifier que le compte n'est pas désactivé
   * 4. Comparer le mot de passe avec le hash stocké
   * 5. Journaliser la connexion
   * 6. Générer un token JWT
   * 7. Retourner l'utilisateur et le token
   */
  async login(data: LoginInput, context?: RequestContext) {
    // Recherche de l'utilisateur avec email normalisé.
    const user = await userRepository.findByEmail(data.email.toLowerCase());

    // Cas où aucun utilisateur ne correspond à l'email fourni.
    if (!user) {
      await logService.security(
        "LOGIN_FAILED",
        {
          email: data.email,
          ipAddress: context?.ipAddress,
          userAgent: context?.userAgent,
        },
        "USER_NOT_FOUND",
      );

      throw new AppError("Identifiants incorrects", 401);
    }

    // Empêche la connexion d'un compte désactivé.
    if (user.status === UserStatus.DISABLED) {
      await logService.security(
        "ACCOUNT_DISABLED",
        {
          userId: user.id,
          email: user.email,
          ipAddress: context?.ipAddress,
          userAgent: context?.userAgent,
        },
        "DISABLED_ACCOUNT_LOGIN_ATTEMPT",
      );

      throw new AppError("Compte désactivé", 403);
    }

    // Compare le mot de passe reçu avec le hash stocké en base.
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    // Cas où le mot de passe est incorrect.
    if (!isPasswordValid) {
      await logService.security(
        "LOGIN_FAILED",
        {
          userId: user.id,
          email: user.email,
          ipAddress: context?.ipAddress,
          userAgent: context?.userAgent,
        },
        "INVALID_PASSWORD",
      );

      throw new AppError("Identifiants incorrects", 401);
    }

    // Journal de sécurité pour une connexion réussie.
    await logService.security("LOGIN_SUCCESS", {
      userId: user.id,
      email: user.email,
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
    });

    // Journal d'activité fonctionnelle.
    await logService.activity("LOGIN", {
      userId: user.id,
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
    });

    // Génération du token JWT contenant les informations nécessaires
    // pour identifier l'utilisateur dans les requêtes suivantes.
    const accessToken = generateToken({
      userId: user.id,
      role: user.role,
    });

    // Retourne uniquement les informations utiles au client.
    // Le mot de passe hashé n'est jamais renvoyé.
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

  /**
   * Récupère l'utilisateur actuellement connecté.
   *
   * @param userId Identifiant extrait du token JWT
   */
  async me(userId: number) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("Utilisateur introuvable", 404);
    }

    return user;
  },
};
