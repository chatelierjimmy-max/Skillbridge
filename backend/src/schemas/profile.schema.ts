import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    bio: z.string().max(1000).optional(),
    level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
    availability: z.string().max(255).optional(),
    location: z.string().max(255).optional(),
  }),
});
