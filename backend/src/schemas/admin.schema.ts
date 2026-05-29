import { z } from "zod";

export const adminUserIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
