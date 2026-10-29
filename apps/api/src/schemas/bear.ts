import { z } from 'zod';

export const BearId = z.string().regex(/^[a-z]+(-[a-z]+)*$/);

export const BearSchema = z.object({
  id: BearId,
  name: z.string().min(1),
  binomial: z.string().min(1),
  fileName: z.string().min(1),
  image: z.string().url().optional(),
  range: z.string().nullable(),
});

export const BearsSchema = z.array(BearSchema);

export type Bear = z.infer<typeof BearSchema>;
