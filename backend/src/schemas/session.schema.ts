import { z } from "zod";

export const createSessionSchema = z.object({
  params: z.object({
    groupId: z.coerce.number().int().positive(),
  }),
  body: z.object({
    title: z.string().min(3).max(150),
    description: z.string().max(1000).optional(),
    startDate: z.string().datetime(),
    duration: z.number().int().min(15).max(480),
    maxParticipants: z.number().int().positive().optional(),
  }),
});

export const groupIdParamSchema = z.object({
  params: z.object({
    groupId: z.coerce.number().int().positive(),
  }),
});

export const sessionIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
