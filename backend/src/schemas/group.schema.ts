import { z } from "zod";

export const createGroupSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(150),
    description: z.string().max(1000).optional(),
    level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
    skillId: z.number().int().positive(),
  }),
});

export const groupIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
