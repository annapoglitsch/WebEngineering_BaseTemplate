import type { Bear } from './types';
import { highlightText } from '../search/HighlightText.tsx';

interface BearCardProps {
  bear: Bear;
  searchTerm: string;
}

export function BearCard({
  bear,
  searchTerm,
}: BearCardProps): React.JSX.Element {
  return (
    <div className="bear">
      <a href={`/bears/${encodeURIComponent(bear.id)}`}>
        <img
          src={bear.image}
          alt={`Image of ${bear.name}`}
          style={{ width: '200px', height: 'auto' }}
        />
      </a>
      <p>
        <a href={`/bears/${encodeURIComponent(bear.id)}`}>
          <b>{highlightText(bear.name, searchTerm)}</b> ({bear.binomial})
        </a>
      </p>

      <p>{highlightText(`Range: ${bear.range ?? 'Unknown'}`, searchTerm)}</p>
    </div>
  );
}
