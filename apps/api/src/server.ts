import Fastify from 'fastify';
import { ApiError, NotFoundError } from './errors/upStreamErrors.js';
import { bearRoutes } from './routes/bears.js';
import { commentRoutes } from './routes/comments.js';

const fastify = Fastify({
  logger: true,
  requestIdHeader: 'x-request-id',
});

interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  requestId: string;
  errors?: ApiError['errors'];
}

function createProblem(
  request: { id: string; url: string },
  status: number,
  title: string,
  detail: string,
  errors?: ApiError['errors']
): ProblemDetails {
  return {
    type: 'about:blank',
    title,
    status,
    detail,
    instance: `${request.url}#${request.id}`,
    requestId: request.id,
    ...(errors ? { errors } : {}),
  };
}

fastify.addHook('onRequest', async (request, reply) => {
  reply.header('x-request-id', request.id);
});

fastify.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error, requestId: request.id }, 'Request failed');

  if (error instanceof ApiError) {
    const problem = createProblem(
      request,
      error.statusCode,
      error.title,
      error.message,
      error.errors
    );

    return reply
      .code(error.statusCode)
      .type('application/problem+json')
      .send(problem);
  }

  const problem = createProblem(
    request,
    500,
    'Internal Server Error',
    'An unexpected error occurred.'
  );

  return reply.code(500).type('application/problem+json').send(problem);
});

fastify.setNotFoundHandler((request, reply) => {
  const error = new NotFoundError('The requested resource was not found.');

  const problem = createProblem(
    request,
    error.statusCode,
    error.title,
    error.message
  );

  return reply
    .code(error.statusCode)
    .type('application/problem+json')
    .send(problem);
});

fastify.get('/health', async () => ({
  statusCode: 200,
  status: 'ok',
  version: '1.0.0',
  uptime: process.uptime(),
}));

await fastify.register(bearRoutes);
await fastify.register(commentRoutes);

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
