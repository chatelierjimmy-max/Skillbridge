import { z } from "zod";

export const groupMessagesParamSchema = z.object({
  params: z.object({
    groupId: z.coerce.number().int().positive(),
  }),
});

export const createMessageSchema = z.object({
  params: z.object({
    groupId: z.coerce.number().int().positive(),
  }),
  body: z.object({
    content: z
      .string()
      .trim()
      .min(1, "Le message ne peut pas être vide")
      .max(1000, "Le message ne peut pas dépasser 1000 caractères"),
  }),
});

export const messageIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Identifiant du message invalide"),
  }),
});
