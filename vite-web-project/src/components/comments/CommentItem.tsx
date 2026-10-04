import type { JSX } from 'react';
import type { Comment } from './types.ts';
import { highlightText } from '../search/HighlightText.tsx';

interface CommentItemProps {
  comment: Comment;
  searchTerm: string;
}

export function CommentItem({
  comment,
  searchTerm,
}: CommentItemProps): JSX.Element {
  return (
    <li>
      <p>{highlightText(comment.name, searchTerm)}</p>
      <p>{highlightText(comment.text, searchTerm)}</p>
    </li>
  );
}
