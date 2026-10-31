import type { JSX } from 'react';
import type { Comment } from './types.ts';
import { highlightText } from '../search/HighlightText.tsx';

interface CommentItemProps {
  comment: Comment;
  searchTerm: string;
  onDelete: (commentId: string) => void;
}

export function CommentItem({
  comment,
  searchTerm,
  onDelete,
}: CommentItemProps): JSX.Element {
  return (
    <li>
      <p>{highlightText(comment.author, searchTerm)}</p>
      <p>{highlightText(comment.text, searchTerm)}</p>
      <button type="button" onClick={() => onDelete(comment.id)}>
        Delete
      </button>
    </li>
  );
}
