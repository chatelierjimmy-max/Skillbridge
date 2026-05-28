import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    firstname: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères")
      .max(100),
    lastname: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(100),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Le mot de passe est obligatoire"),
  }),
});
