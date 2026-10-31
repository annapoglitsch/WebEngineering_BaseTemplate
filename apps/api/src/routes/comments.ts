import type { FastifyPluginAsync } from 'fastify';
import { CreateCommentSchema } from '../schemas/comment.js';
import {
  createComment,
  deleteComment,
  getCommentsByBearId,
} from '../services/commentService.js';
import { fetchBearById } from '../services/bearService.js';
import { UpstreamTimeoutError } from '../errors/upStreamErrors.js';

function upstreamStatus(error: unknown): number {
  return error instanceof UpstreamTimeoutError ? 504 : 502;
}

export const commentRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Params: { id: string } }>(
    '/api/bears/:id/comments',
    async (request, reply) => {
      try {
        const bear = await fetchBearById(request.params.id);

        if (!bear) {
          return reply.code(404).send({ error: 'Bear not found' });
        }

        return getCommentsByBearId(request.params.id);
      } catch (error) {
        app.log.error({ err: error }, 'Failed to fetch bear for comments');
        return reply.code(upstreamStatus(error)).send({
          error: 'Could not retrieve bear data',
        });
      }
    }
  );

  app.post<{ Params: { id: string }; Body: unknown }>(
    '/api/bears/:id/comments',
    async (request, reply) => {
      const result = CreateCommentSchema.safeParse(request.body);

      if (!result.success) {
        return reply.code(400).send({
          error: 'Invalid comment',
          details: result.error.issues,
        });
      }

      try {
        const bear = await fetchBearById(request.params.id);

        if (!bear) {
          return reply.code(404).send({ error: 'Bear not found' });
        }

        const comment = createComment(request.params.id, result.data);

        return reply
          .code(201)
          .header('Location', `/api/comments/${comment.id}`)
          .send(comment);
      } catch (error) {
        app.log.error({ err: error }, 'Failed to create comment');
        return reply.code(upstreamStatus(error)).send({
          error: 'Could not retrieve bear data',
        });
      }
    }
  );

  app.delete<{ Params: { commentId: string } }>(
    '/api/comments/:commentId',
    async (request, reply) => {
      const deleted = deleteComment(request.params.commentId);

      if (!deleted) {
        return reply.code(404).send({ error: 'Comment not found' });
      }

      return reply.code(204).send();
    }
  );
};
