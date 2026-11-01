import { useEffect, useState } from 'react';
import type { Bear } from './types';
import { API_BASE_URL } from '../../api';

interface BearDetailsProps {
  bearId: string;
}

export function BearDetails({ bearId }: BearDetailsProps): React.JSX.Element {
  const [bear, setBear] = useState<Bear | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBear(): Promise<void> {
      setBear(null);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/bears/${encodeURIComponent(bearId)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const foundBear: Bear = await response.json();
        setBear(foundBear);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError('Bear details could not be loaded.');
      }
    }

    void loadBear();

    return () => controller.abort();
  }, [bearId]);

  if (error !== null) {
    return <p role="alert">{error}</p>;
  }

  if (bear === null) {
    return <p>Loading bear...</p>;
  }

  return (
    <section>
      <a href="/bears">← Back to all bears</a>
      <h2>{bear.name}</h2>

      <p>
        <strong>Scientific name:</strong> {bear.binomial}
      </p>

      <p>
        <strong>Range:</strong> {bear.range ?? 'Unknown'}
      </p>

      {bear.image && (
        <img
          src={bear.image}
          alt={`Image of ${bear.name}`}
          style={{ width: '400px', height: 'auto' }}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/media/noImageFound.png';
          }}
        />
      )}
    </section>
  );
}
