import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import type { Comment } from './types.ts';

interface CommentSectionProps {
  searchTerm: string;
  bearId: string;
}

export function CommentSection({
  searchTerm,
  bearId,
}: CommentSectionProps): JSX.Element {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!showComments) {
      return;
    }

    const controller = new AbortController();

    async function loadComments(): Promise<void> {
      try {
        setError(null);

        const response = await fetch(
          `/api/bears/${encodeURIComponent(bearId)}/comments`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Failed to load comments: ${response.status}`);
        }

        const data: Comment[] = await response.json();
        setComments(data);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        setError('Comments could not be loaded.');
      }
    }

    void loadComments();

    return () => {
      controller.abort();
    };
  }, [bearId, showComments]);

  const addComment = async (author: string, text: string): Promise<void> => {
    const response = await fetch(
      `/api/bears/${encodeURIComponent(bearId)}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author, text }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create comment: ${response.status}`);
    }

    const newComment: Comment = await response.json();

    setComments((currentComments) => [...currentComments, newComment]);
  };

  const removeComment = async (commentId: string): Promise<void> => {
    try {
      setError(null);

      const response = await fetch(
        `/api/comments/${encodeURIComponent(commentId)}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.status}`);
      }

      setComments((currentComments) =>
        currentComments.filter((comment) => comment.id !== commentId)
      );
    } catch {
      setError('Comment could not be deleted.');
    }
  };

  return (
    <section>
      <button
        type="button"
        onClick={() => {
          setShowComments((visible) => !visible);
        }}
      >
        {showComments ? 'Hide comment' : 'Show comment'}
      </button>

      {showComments && (
        <div className="comment-wrapper">
          {error && <p role="alert">{error}</p>}
          <CommentForm onAddComment={addComment} />
          <CommentList
            comments={comments}
            searchTerm={searchTerm}
            onDelete={removeComment}
          />
        </div>
      )}
    </section>
  );
}
