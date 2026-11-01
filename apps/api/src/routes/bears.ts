import type { FastifyPluginAsyncZod } from '@fastify/type-provider-zod';
import { fetchBears, fetchBearById } from '../services/bearService.js';
import { NotFoundError } from '../errors/upStreamErrors.js';
import { BearId, BearSchema, BearsSchema } from '../schemas/bear.js';
import { z } from 'zod';
import { ProblemDetailsSchema } from '../schemas/problem.js';

export const bearRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/bears',
    {
      schema: {
        response: {
          200: BearsSchema,
          500: ProblemDetailsSchema,
          502: ProblemDetailsSchema,
          504: ProblemDetailsSchema,
        },
      },
    },
    async () => {
      return await fetchBears();
    }
  );

  app.get(
    '/api/bears/:id',
    {
      schema: {
        params: z.object({
          id: BearId,
        }),
        response: {
          200: BearSchema,
          404: ProblemDetailsSchema,
          500: ProblemDetailsSchema,
          502: ProblemDetailsSchema,
          504: ProblemDetailsSchema,
        },
      },
    },
    async (request) => {
      const bear = await fetchBearById(request.params.id);

      if (!bear) {
        throw new NotFoundError('Bear not found');
      }

      return bear;
    }
  );
};
