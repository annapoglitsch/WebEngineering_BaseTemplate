import { randomUUID } from 'node:crypto';
import {
  CommentSchema,
  type Comment,
  type CreateComment,
} from '../schemas/comment.js';

const comments = new Map<string, Comment>();

export function getCommentsByBearId(bearId: string): Comment[] {
  return Array.from(comments.values()).filter(
    (comment) => comment.bearId === bearId
  );
}

export function createComment(bearId: string, input: CreateComment): Comment {
  const comment = CommentSchema.parse({
    id: randomUUID(),
    bearId,
    author: input.author,
    text: input.text,
  });

  comments.set(comment.id, comment);

  return comment;
}

export function deleteComment(commentId: string): boolean {
  return comments.delete(commentId);
}
