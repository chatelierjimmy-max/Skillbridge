import { z } from "zod";

export const addUserSkillSchema = z.object({
  body: z.object({
    skillId: z.number().int().positive(),
    level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  }),
});

export const skillIdParamSchema = z.object({
  params: z.object({
    skillId: z.coerce.number().int().positive(),
  }),
});
