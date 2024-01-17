import { z } from 'zod';

export const filterSchema = z.object({
  bounty: z.number().optional(),
  category: z.string().optional(),
  fromDate: z.date().optional(),
  isPaid: z.boolean().optional(),
  language: z.string().optional(),
  name: z.string().optional(),
  platform: z.string().optional(),
  toDate: z.date().optional(),
});
