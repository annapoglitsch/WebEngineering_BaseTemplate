import type { Bear } from './types';

export async function fetchBears(signal?: AbortSignal): Promise<Bear[]> {
  const response = await fetch('/api/bears', { signal });

  if (!response.ok) {
    throw new Error(
      `Bären konnten nicht geladen werden (HTTP ${response.status})`
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Ungültige Antwort vom Server');
  }

  return data as Bear[];
}
