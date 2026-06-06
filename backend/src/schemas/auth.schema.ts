// Import de la bibliothèque Zod.
// Elle permet de valider les données reçues
// dans les requêtes HTTP avant d'atteindre les contrôleurs.
import { z } from "zod";

/**
 * ====================================
 * Schéma de validation de l'inscription
 * ====================================
 *
 * Utilisé par :
 * POST /auth/register
 *
 * Ce schéma valide toutes les informations
 * nécessaires à la création d'un compte.
 */
export const registerSchema = z.object({
  /**
   * Validation du corps de la requête HTTP.
   */
  body: z.object({
    /**
     * Prénom de l'utilisateur.
     *
     * Contraintes :
     * - chaîne de caractères
     * - minimum 2 caractères
     * - maximum 100 caractères
     */
    firstname: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères")
      .max(100),

    /**
     * Nom de famille.
     *
     * Contraintes :
     * - chaîne de caractères
     * - minimum 2 caractères
     * - maximum 100 caractères
     */
    lastname: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(100),

    /**
     * Adresse email.
     *
     * Vérifie que la valeur respecte
     * le format standard d'une adresse email.
     */
    email: z.string().email("Email invalide"),

    /**
     * Mot de passe.
     *
     * Contraintes de sécurité :
     * - minimum 8 caractères
     * - au moins une majuscule
     * - au moins une minuscule
     * - au moins un chiffre
     */
    password: z
      .string()

      // Longueur minimale
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")

      // Présence d'une lettre majuscule
      .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")

      // Présence d'une lettre minuscule
      .regex(/[a-z]/, "Le mot de passe doit contenir une minuscule")

      // Présence d'un chiffre
      .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre"),
  }),
});

/**
 * ====================================
 * Schéma de validation de la connexion
 * ====================================
 *
 * Utilisé par :
 * POST /auth/login
 *
 * Les règles sont plus simples car
 * l'utilisateur possède déjà un compte.
 */
export const loginSchema = z.object({
  /**
   * Validation du corps de la requête.
   */
  body: z.object({
    /**
     * Adresse email.
     *
     * Vérifie uniquement que le format
     * est valide.
     */
    email: z.string().email("Email invalide"),

    /**
     * Mot de passe.
     *
     * Vérifie simplement que le champ
     * n'est pas vide.
     *
     * Les règles de complexité ont déjà été
     * appliquées lors de l'inscription.
     */
    password: z.string().min(1, "Le mot de passe est obligatoire"),
  }),
});
