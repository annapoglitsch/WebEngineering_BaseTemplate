import type { Bear } from './types';

const baseUrl = 'https://en.wikipedia.org/w/api.php';
const title = 'List_of_ursids';
const bearSectionIndex = 3;

interface ImageInfo {
    url: string;
}

interface WikipediaPage {
    imageinfo?: ImageInfo[];
}

interface WikipediaImageResponse {
    query?: {
        pages?: Record<string, WikipediaPage>;
    };
}

interface WikipediaParseResponse {
    parse?: {
        wikitext?: {
            '*': string;
        };
    };
}

function isWikipediaImageResponse(
    value: unknown,
): value is WikipediaImageResponse {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const data = value as WikipediaImageResponse;

    return data.query !== undefined;
}

function isWikipediaParseResponse(
    value: unknown,
): value is WikipediaParseResponse {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const data = value as WikipediaParseResponse;

    return data.parse !== undefined;
}

export async function fetchImageUrl(fileName: string): Promise<string> {
    const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        prop: 'imageinfo',
        iiprop: 'url',
        titles: `File:${fileName}`,
        origin: '*',
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isWikipediaImageResponse(data)) {
        throw new Error('Ungültige Wikipedia-Bildantwort');
    }

    const pages = data.query?.pages;

    if (pages === undefined) {
        throw new Error('Keine Bilddaten gefunden');
    }

    const page = Object.values(pages)[0];

    const imageUrl = page?.imageinfo?.[0]?.url;

    if (imageUrl === undefined) {
        throw new Error('Keine Bild-URL gefunden');
    }

    return imageUrl;
}

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

    if (
        nameMatch === null ||
        binomialMatch === null ||
        imageMatch === null
    ) {
        return null;
    }

    return {
        name: nameMatch[1],
        binomial: binomialMatch[1].trim(),
        fileName: imageMatch[1].trim().replace('File:', ''),
        range: rangeMatch?.[1]?.trim() ?? null,
    };
}

export async function fetchBears(): Promise<Bear[]> {
    const params = new URLSearchParams({
        action: 'parse',
        page: title,
        prop: 'wikitext',
        section: String(bearSectionIndex),
        format: 'json',
        origin: '*',
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isWikipediaParseResponse(data)) {
        throw new Error('Ungültige Wikipedia-Antwort');
    }

    const wikitext = data.parse?.wikitext?.['*'];

    if (wikitext === undefined) {
        throw new Error('Wikipedia-Antwort enthält keinen Wikitext');
    }

    return extractBears(wikitext);
}