import { z } from 'zod';

export const filterSchema = z.object({
  query: z.string().optional(),
  attackVector: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  target: z.string().optional(),
});
