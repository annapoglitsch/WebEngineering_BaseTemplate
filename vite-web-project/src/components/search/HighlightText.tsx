import type { ReactNode } from 'react';

export function highlightText(text: string, searchTerm: string): ReactNode {
  const trimmedSearchTerm = searchTerm.trim();

  if (trimmedSearchTerm === '') {
    return text;
  }

  const escapedSearchTerm = trimmedSearchTerm.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');

  return text.split(regex).map((part, index) => {
    if (part.toLowerCase() === trimmedSearchTerm.toLowerCase()) {
      return (
        <mark className="highlight" key={`${part}-${index}`}>
          {part}
        </mark>
      );
    }

    return part;
  });
}
