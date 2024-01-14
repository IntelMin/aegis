import { z } from 'zod';

export const filterSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
});
