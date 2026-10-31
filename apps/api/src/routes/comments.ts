import type { FastifyPluginAsync } from 'fastify';
import { CreateCommentSchema } from '../schemas/comment.js';
import { BadRequestError, NotFoundError } from '../errors/upStreamErrors.js';
import {
  createComment,
  deleteComment,
  getCommentsByBearId,
} from '../services/commentService.js';
import { fetchBearById } from '../services/bearService.js';

export const commentRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Params: { id: string } }>(
    '/api/bears/:id/comments',
    async (request) => {
      const bear = await fetchBearById(request.params.id);

      if (!bear) {
        throw new NotFoundError('Bear not found');
      }

      return getCommentsByBearId(request.params.id);
    }
  );

  app.post<{ Params: { id: string }; Body: unknown }>(
    '/api/bears/:id/comments',
    async (request, reply) => {
      const result = CreateCommentSchema.safeParse(request.body);

      if (!result.success) {
        throw new BadRequestError(
          'The comment data is invalid.',
          result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          }))
        );
      }

      const bear = await fetchBearById(request.params.id);

      if (!bear) {
        throw new NotFoundError('Bear not found');
      }

      const comment = createComment(request.params.id, result.data);

      return reply
        .code(201)
        .header('Location', `/api/comments/${comment.id}`)
        .send(comment);
    }
  );

  app.delete<{ Params: { commentId: string } }>(
    '/api/comments/:commentId',
    async (request, reply) => {
      const deleted = deleteComment(request.params.commentId);

      if (!deleted) {
        throw new NotFoundError('Comment not found');
      }

      return reply.code(204).send();
    }
  );
};
