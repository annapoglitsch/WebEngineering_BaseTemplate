import type { JSX } from 'react';
import type { Comment } from './types.ts';
import { CommentItem } from './CommentItem.tsx';

interface CommentListProps {
  comments: Comment[];
  searchTerm: string;
}

export function CommentList({
  comments,
  searchTerm,
}: CommentListProps): JSX.Element {
  return (
    <ul className="comment-container">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          searchTerm={searchTerm}
        />
      ))}
    </ul>
  );
}
