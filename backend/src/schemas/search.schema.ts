import { z } from "zod";

export const searchLearnersSchema = z.object({
  query: z.object({
    skill: z.string().max(100).optional(),
    level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
    city: z.string().max(150).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(50).optional(),
  }),
});
