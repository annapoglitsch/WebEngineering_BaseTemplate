import { useState } from 'react';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import type {Comment} from "./types.ts";

type CommentSectionProps = {
    searchTerm: string;
};

export function CommentSection({ searchTerm }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [showComments, setShowComments] = useState(false);

    const addComment = (name: string, text: string) => {
        const newComment: Comment = {
            id: crypto.randomUUID(),
            name,
            text,
        };

        setComments((currentComments) => [
            ...currentComments,
            newComment,
        ]);
    };

    return (
        <section>
            <button
                type="button"
                onClick={() => setShowComments((visible) => !visible)}
            >
                {showComments ? 'Hide comment' : 'Show comment'}
            </button>

            {showComments && (
                <div className="comment-wrapper">
                    <CommentForm onAddComment={addComment} />
                    <CommentList comments={comments} searchTerm={searchTerm}/>
                </div>
            )}
        </section>
    );
}