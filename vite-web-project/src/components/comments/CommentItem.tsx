import type {Comment} from './types.ts'
import {highlightText} from "../search/HighlightText.tsx";

type CommentItemProps = {
    comment: Comment;
    searchTerm: string;
};

export function CommentItem({ comment , searchTerm}: CommentItemProps) {
    return (
        <li>
            <p>{highlightText(comment.name, searchTerm)}</p>
            <p>{highlightText(comment.text, searchTerm)}</p>
        </li>
    );
}