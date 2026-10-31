import { z } from 'zod';

export const CreateCommentSchema = z.object({
  author: z.string().trim().min(1).max(50),
  text: z.string().trim().min(1).max(1000),
});

export const CommentSchema = z.object({
  id: z.string().uuid(),
  bearId: z.string().min(1),
  author: z.string().min(1).max(50),
  text: z.string().min(1).max(1000),
});

export type CreateComment = z.infer<typeof CreateCommentSchema>;
export type Comment = z.infer<typeof CommentSchema>;
