import type { JSX } from 'react';
import type { Bear } from './types';
import { BearCard } from './BearCard';

interface BearListProps {
  bears: Bear[];
  searchTerm: string;
}

export function BearList({ bears, searchTerm }: BearListProps): JSX.Element {
  return (
    <div className="bear-list">
      {bears.map((bear) => (
        <BearCard key={bear.id} bear={bear} searchTerm={searchTerm} />
      ))}
    </div>
  );
}
