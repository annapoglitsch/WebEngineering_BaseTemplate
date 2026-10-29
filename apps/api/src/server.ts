import Fastify from 'fastify';
import { bearRoutes } from './routes/bears.js';

const fastify = Fastify({ logger: true });

fastify.get('/health', async () => ({
  statusCode: 200,
  status: 'ok',
  version: '1.0.0',
  uptime: process.uptime(),
}));

await fastify.register(bearRoutes);

const start = async (): Promise<void> => {
  try {
    await fastify.listen({
      port: Number(process.env.PORT ?? 3000),
      host: '0.0.0.0',
    });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

void start();
