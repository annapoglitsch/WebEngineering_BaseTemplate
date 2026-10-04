import type {Bear} from "./types.ts";

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

    if (
        nameMatch === null ||
        binomialMatch === null ||
        imageMatch === null
    ) {
        return null;
    }

    return {
        name: nameMatch[1],
        binomial: binomialMatch[1],
        fileName: imageMatch[1].trim().replace('File:', ''),
        range: null,
    };
}