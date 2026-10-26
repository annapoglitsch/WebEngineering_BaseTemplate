import { useState, type FormEvent, type JSX } from 'react';

interface SearchFormProps {
  onSearch: (searchTerm: string) => void;
}

export function SearchForm({ onSearch }: SearchFormProps): JSX.Element {
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
