import type { FastifyPluginAsync } from 'fastify';
import { fetchBears, fetchBearById } from '../services/bearServices.js';
import { UpstreamTimeoutError } from '../errors/upStreamErrors.js';

function upstreamStatus(error: unknown): number {
  return error instanceof UpstreamTimeoutError ? 504 : 502;
}

export const bearRoutes: FastifyPluginAsync = async (app) => {
  app.get('/api/bears', async (_request, reply) => {
    try {
      return await fetchBears();
    } catch (error) {
      app.log.error({ err: error }, 'Failed to fetch bears');
      return reply.code(upstreamStatus(error)).send({
        error: 'Could not retrieve bear data',
      });
    }
  });

  app.get<{ Params: { id: string } }>(
    '/api/bears/:id',
    async (request, reply) => {
      try {
        const bear = await fetchBearById(request.params.id);

        if (!bear) {
          return reply.code(404).send({
            error: 'Bear not found',
          });
        }

        return bear;
      } catch (error) {
        app.log.error({ err: error }, 'Failed to fetch bear');
        return reply.code(upstreamStatus(error)).send({
          error: 'Could not retrieve bear data',
        });
      }
    }
  );
};
