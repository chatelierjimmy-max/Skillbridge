// Importation de Zod
// Zod est une bibliothèque de validation de données.
// Elle permet de définir des schémas de validation robustes et typés.
import { z } from "zod";

/**
 * Schéma de validation du formulaire d'inscription.
 *
 * Chaque propriété représente un champ du formulaire
 * et contient ses règles de validation.
 */
export const registerSchema = z.object({
  /**
   * Prénom de l'utilisateur.
   *
   * Doit être une chaîne de caractères
   * contenant au moins 2 caractères.
   */
  firstname: z.string().min(2, "Prénom trop court"),

  /**
   * Nom de famille de l'utilisateur.
   *
   * Doit contenir au moins 2 caractères.
   */
  lastname: z.string().min(2, "Nom trop court"),

  /**
   * Adresse email.
   *
   * La méthode email() vérifie automatiquement
   * le format de l'adresse.
   */
  email: z.string().email("Email invalide"),

  /**
   * Mot de passe.
   *
   * Contraintes :
   * - minimum 8 caractères
   * - au moins une majuscule
   * - au moins une minuscule
   * - au moins un chiffre
   */
  password: z
    .string()

    // Longueur minimale
    .min(8, "Minimum 8 caractères")

    // Vérifie la présence d'une lettre majuscule
    .regex(/[A-Z]/, "Une majuscule requise")

    // Vérifie la présence d'une lettre minuscule
    .regex(/[a-z]/, "Une minuscule requise")

    // Vérifie la présence d'un chiffre
    .regex(/[0-9]/, "Un chiffre requis"),
});

/**
 * Schéma de validation du formulaire de connexion.
 *
 * Moins strict que l'inscription car
 * les données ont déjà été validées lors de la création du compte.
 */
export const loginSchema = z.object({
  /**
   * Adresse email.
   */
  email: z.string().email("Email invalide"),

  /**
   * Mot de passe.
   *
   * Vérifie simplement que le champ n'est pas vide.
   */
  password: z.string().min(1, "Mot de passe obligatoire"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Lien de réinitialisation invalide"),

    password: z
      .string()
      .min(8, "Minimum 8 caractères")
      .regex(/[A-Z]/, "Une majuscule requise")
      .regex(/[a-z]/, "Une minuscule requise")
      .regex(/[0-9]/, "Un chiffre requis"),

    confirmPassword: z.string().min(1, "Confirmation obligatoire"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

/**
 * Génération automatique du type TypeScript
 * à partir du schéma d'inscription.
 *
 * Équivalent approximatif :
 *
 * {
 *   firstname: string;
 *   lastname: string;
 *   email: string;
 *   password: string;
 * }
 */
export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Génération automatique du type TypeScript
 * à partir du schéma de connexion.
 *
 * Équivalent approximatif :
 *
 * {
 *   email: string;
 *   password: string;
 * }
 */
export type LoginFormData = z.infer<typeof loginSchema>;

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
