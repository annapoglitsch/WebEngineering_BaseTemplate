import type { Bear } from './types';
import { BearCard } from './BearCard';

type BearListProps = {
    bears: Bear[];
    searchTerm: string;
};

export function BearList({ bears, searchTerm }: BearListProps) {
    return (
        <div className="bear-list">
            {bears.map((bear) => (
                <BearCard
                    key={bear.id}
                    bear={bear}
                    searchTerm={searchTerm}
                />
            ))}
        </div>
    );
}