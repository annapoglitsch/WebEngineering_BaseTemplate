import type { FastifyPluginAsyncZod } from '@fastify/type-provider-zod';
import { z } from 'zod';
import { CreateCommentSchema, CommentSchema } from '../schemas/comment.js';
import { NotFoundError } from '../errors/upStreamErrors.js';
import { BearId } from '../schemas/bear.js';
import {
  createComment,
  deleteComment,
  getCommentsByBearId,
} from '../services/commentService.js';
import { fetchBearById } from '../services/bearService.js';
import { ProblemDetailsSchema } from '../schemas/problem.js';

export const commentRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/bears/:id/comments',
    {
      schema: {
        params: z.object({
          id: BearId,
        }),
        response: {
          200: z.array(CommentSchema),
          404: ProblemDetailsSchema,
          500: ProblemDetailsSchema,
        },
      },
    },
    async (request) => {
      const bear = await fetchBearById(request.params.id);

      if (!bear) {
        throw new NotFoundError('Bear not found');
      }

      return getCommentsByBearId(request.params.id);
    }
  );

  app.post(
    '/api/bears/:id/comments',
    {
      schema: {
        params: z.object({
          id: BearId,
        }),
        body: CreateCommentSchema,
        response: {
          201: CommentSchema,
          400: ProblemDetailsSchema,
          404: ProblemDetailsSchema,
          500: ProblemDetailsSchema,
        },
      },
    },
    async (request, reply) => {
      const bear = await fetchBearById(request.params.id);

      if (!bear) {
        throw new NotFoundError('Bear not found');
      }

      const comment = createComment(request.params.id, request.body);

      return reply
        .code(201)
        .header('Location', `/api/comments/${comment.id}`)
        .send(comment);
    }
  );

  app.delete(
    '/api/comments/:commentId',
    {
      schema: {
        params: z.object({
          commentId: z.string().uuid(),
        }),
        response: {
          204: z.void(),
          404: ProblemDetailsSchema,
          500: ProblemDetailsSchema,
        },
      },
    },
    async (request, reply) => {
      const deleted = deleteComment(request.params.commentId);

      if (!deleted) {
        throw new NotFoundError('Comment not found');
      }

      return reply.code(204).send();
    }
  );
};
