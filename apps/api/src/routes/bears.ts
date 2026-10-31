import type { FastifyPluginAsync } from 'fastify';
import { fetchBears, fetchBearById } from '../services/bearService.js';
import { NotFoundError } from '../errors/upStreamErrors.js';

export const bearRoutes: FastifyPluginAsync = async (app) => {
  app.get('/api/bears', async () => {
    return await fetchBears();
  });

  app.get<{ Params: { id: string } }>('/api/bears/:id', async (request) => {
    const bear = await fetchBearById(request.params.id);

    if (!bear) {
      throw new NotFoundError('Bear not found');
    }

    return bear;
  });
};
