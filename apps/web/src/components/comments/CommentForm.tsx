import { useState } from 'react';
import type { JSX } from 'react';

interface CommentFormProps {
  onAddComment: (author: string, text: string) => Promise<void>;
}

export function CommentForm({ onAddComment }: CommentFormProps): JSX.Element {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedText = text.trim();

    if (trimmedName === '' || trimmedText === '') {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await onAddComment(trimmedName, trimmedText);

      setName('');
      setText('');
    } catch {
      setError('Comment could not be created.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input
        id="name"
        name="name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={50}
        required
      />

      <textarea
        id="comment"
        name="comment"
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={1000}
        required
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add comment'}
      </button>
    </form>
  );
}
