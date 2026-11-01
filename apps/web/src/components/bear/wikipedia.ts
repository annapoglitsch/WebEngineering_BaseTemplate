import type { Bear } from './types';
import { API_BASE_URL } from '../../api.ts';

export async function fetchBears(signal?: AbortSignal): Promise<Bear[]> {
  const response = await fetch(`${API_BASE_URL}/api/bears`, { signal });

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
