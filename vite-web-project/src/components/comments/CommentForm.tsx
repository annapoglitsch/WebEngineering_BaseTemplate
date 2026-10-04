import { useState } from 'react';

type CommentFormProps = {
    onAddComment: (name: string, text: string) => void;
};

export function CommentForm({ onAddComment }: CommentFormProps) {
    const [name, setName] = useState('');
    const [text, setText] = useState('');

    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedText = text.trim();

        if (trimmedName === '' || trimmedText === '') {
            return;
        }

        onAddComment(trimmedName, trimmedText);

        setName('');
        setText('');
    }

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => {
                    setName(event.target.value);
                }}
            />

            <textarea
                id="comment"
                name="comment"
                value={text}
                onChange={(event) => {
                    setText(event.target.value);
                }}
            />

            <button type="submit">Add comment</button>
        </form>
    );
}
