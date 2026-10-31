import type { JSX } from 'react';
import type { Comment } from './types.ts';
import { CommentItem } from './CommentItem.tsx';

interface CommentListProps {
  comments: Comment[];
  searchTerm: string;
  onDelete: (commentId: string) => void;
}

export function CommentList({
  comments,
  searchTerm,
  onDelete,
}: CommentListProps): JSX.Element {
  return (
    <ul className="comment-container">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          searchTerm={searchTerm}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
