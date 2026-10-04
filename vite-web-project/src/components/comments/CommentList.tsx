import type {Comment} from "./types.ts";
import {CommentItem} from "./CommentItem.tsx";

type CommentListProps = {
    comments: Comment[];
    searchTerm : string;
};

export function CommentList({ comments, searchTerm }: CommentListProps) {
    return (
        <ul className="comment-container">
            {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} searchTerm={searchTerm}/>
            ))}
        </ul>
    );
}