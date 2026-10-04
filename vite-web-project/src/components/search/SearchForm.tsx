import { useState, type FormEvent } from 'react';

type SearchFormProps = {
    onSearch: (searchTerm: string) => void;
};

export function SearchForm({ onSearch }: SearchFormProps) {
    const [searchTerm, setSearchTerm] = useState('');

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        onSearch(searchTerm.trim());
    }

    return (
        <form className="search" onSubmit={handleSubmit}>
            <input
                type="search"
                name="q"
                placeholder="Search for wildlife"
                value={searchTerm}
                onChange={(event) => {
                    setSearchTerm(event.target.value);
                }}
            />

            <input type="submit" value="Search" />
        </form>
    );
}