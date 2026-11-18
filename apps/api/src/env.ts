import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z
    .string()
    .regex(/^\d+$/)
    .default('3000')
    .transform(Number)
    .pipe(z.number().int().min(1).max(65535)),
  DATABASE_URL: z
    .string()
    .url()
    .regex(/^postgres(?:ql)?:\/\//),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    )
    .pipe(
      z.array(
        z
          .string()
          .url()
          .regex(/^https?:\/\/[^/?#@]+$/i)
      )
    ),

  WIKIPEDIA_BASE_URL: z
    .string()
    .url()
    .regex(/^https?:\/\//i)
    .default('https://en.wikipedia.org'),

  USER_AGENT: z.string().trim().min(1).optional(),
});

export const env = envSchema.parse(process.env);
