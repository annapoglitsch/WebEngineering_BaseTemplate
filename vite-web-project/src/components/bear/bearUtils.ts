import type { Bear } from './types.ts';

export function extractBears(wikitext: string): Bear[] {
  return wikitext
    .split('{{Species table/row')
    .slice(1)
    .map(parseBearRow)
    .filter((bear): bear is Bear => bear !== null);
}

export function parseBearRow(row: string): Bear | null {
  const nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
  const binomialMatch = row.match(/\|binomial=(.*?)(?:\n|\|)/);
  const imageMatch = row.match(/\|image=(.*?)(?:\n|\|)/);
  const rangeMatch = row.match(/\|range=(.*?)(?:\n|\|)/);

  if (nameMatch === null || binomialMatch === null || imageMatch === null) {
    return null;
  }

  const fileName = imageMatch[1].trim().replace('File:', '');

  return {
    id: fileName,
    name: nameMatch[1].trim(),
    binomial: binomialMatch[1].trim(),
    fileName,
    range: rangeMatch?.[1]?.trim() ?? null,
  };
}
