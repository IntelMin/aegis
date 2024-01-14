import { z } from 'zod';

export const filterSchema = z.object({
  platform: z.string().optional(),
  language: z.string().optional(),
  category: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
});
