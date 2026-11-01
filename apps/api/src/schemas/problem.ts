import { z } from 'zod';

export const ProblemFieldErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
});

export const ProblemDetailsSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number().int(),
  detail: z.string(),
  instance: z.string(),
  requestId: z.string(),
  errors: z.array(ProblemFieldErrorSchema).optional(),
});

export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;
