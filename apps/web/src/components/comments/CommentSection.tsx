import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import type { Comment } from './types.ts';
import { API_BASE_URL } from '../../api';

interface CommentSectionProps {
  searchTerm: string;
  bearId: string;
}

async function getErrorDetail(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const problem: { detail?: string } = await response.json();
    return problem.detail || fallback;
  } catch {
    return fallback;
  }
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
          `${API_BASE_URL}/api/bears/${encodeURIComponent(bearId)}/comments`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            await getErrorDetail(response, 'Comments could not be loaded.')
          );
        }

        const data: Comment[] = await response.json();
        setComments(data);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : 'Comments could not be loaded.'
        );
      }
    }

    void loadComments();

    return () => {
      controller.abort();
    };
  }, [bearId, showComments]);

  const addComment = async (author: string, text: string): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/api/bears/${encodeURIComponent(bearId)}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author, text }),
      }
    );

    if (!response.ok) {
      throw new Error(
        await getErrorDetail(response, 'Comment could not be created.')
      );
    }

    const newComment: Comment = await response.json();

    setComments((currentComments) => [...currentComments, newComment]);
  };

  const removeComment = async (commentId: string): Promise<void> => {
    try {
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/api/comments/${encodeURIComponent(commentId)}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error(
          await getErrorDetail(response, 'Comment could not be deleted.')
        );
      }

      setComments((currentComments) =>
        currentComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Comment could not be deleted.'
      );
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
