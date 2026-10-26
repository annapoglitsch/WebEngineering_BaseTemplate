import { useEffect, useState } from 'react';
import type { Bear } from './types';
import { fetchBears, fetchImageUrl } from './wikipedia';

interface BearDetailsProps {
  bearId: string;
}

export function BearDetails({ bearId }: BearDetailsProps): React.JSX.Element {
  const [bear, setBear] = useState<Bear | null>(null);

  useEffect(() => {
    async function loadBear(): Promise<void> {
      const bears = await fetchBears();
      const foundBear = bears.find((bear) => bear.id === bearId);

      if (foundBear === undefined) {
        return;
      }

      const image = await fetchImageUrl(foundBear.fileName);
      setBear({ ...foundBear, image });
    }

    void loadBear();
  }, [bearId]);

  if (bear === null) {
    return <p>Loading bear...</p>;
  }

  return (
    <section>
      <a href="/bears">← Back to all bears</a>
      <h2>{bear.name}</h2>{' '}
      <p>
        <strong>Scientific name:</strong>
        {bear.binomial}{' '}
      </p>
      <p>
        <strong>Range:</strong>
        {bear.range ?? 'Unknown'}{' '}
      </p>
      {bear.image !== '' && (
        <img
          src={bear.image}
          alt={`Image of ${bear.name}`}
          style={{ width: '400px', height: 'auto' }}
        />
      )}
    </section>
  );
}
