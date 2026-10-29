import { BearSchema, BearsSchema, type Bear } from '../schemas/bear.js';
import {
  fetchWikitext,
  fetchImageUrls,
  normalizeFileName,
} from '../upstream/wikipedia.js';

function createBearId(binomial: string): string {
  return binomial
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseBearRow(row: string): Bear | null {
  const nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
  const binomialMatch = row.match(/\|binomial=(.*?)(?:\n|\|)/);
  const imageMatch = row.match(/\|image=(.*?)(?:\n|\|)/);
  const rangeMatch = row.match(/\|range=(.*?)(?:\n|\|)/);

  if (!nameMatch || !binomialMatch || !imageMatch) {
    return null;
  }

  const name = nameMatch[1].trim();
  const binomial = binomialMatch[1].trim();
  const fileName = imageMatch[1].trim().replace(/^(File|Image):/i, '');

  return BearSchema.parse({
    id: createBearId(binomial),
    name,
    binomial,
    fileName,
    range: rangeMatch?.[1]?.trim() ?? null,
  });
}

function extractBears(wikitext: string): Bear[] {
  const rows = wikitext.split('{{Species table/row').slice(1);

  const bears = rows
    .map(parseBearRow)
    .filter((bear): bear is Bear => bear !== null);

  return BearsSchema.parse(bears);
}

export async function fetchBears(): Promise<Bear[]> {
  const wikitext = await fetchWikitext();
  const bears = extractBears(wikitext);

  if (bears.length === 0) {
    throw new Error('Wikipedia returned no parseable bears');
  }

  const imageUrls = await fetchImageUrls(bears.map((bear) => bear.fileName));

  const result = bears.map((bear) => {
    const image = imageUrls.get(normalizeFileName(bear.fileName));

    return BearSchema.parse({
      ...bear,
      ...(image ? { image } : {}),
    });
  });

  return BearsSchema.parse(result);
}

export async function fetchBearById(id: string): Promise<Bear | null> {
  const bears = await fetchBears();
  return bears.find((bear) => bear.id === id) ?? null;
}
