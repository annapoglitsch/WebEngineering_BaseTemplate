// Fetching bear data

const baseUrl = 'https://en.wikipedia.org/w/api.php';
const title = 'List_of_ursids';
const BearSectionIndex = 3;

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

interface Bear {
  name: string;
  binomial: string;
  fileName: string;
  image?: string;
  range: string | null;
}

const params: Record<string, string> = {
  action: 'parse',
  page: title,
  prop: 'wikitext',
  section: String(BearSectionIndex),
  format: 'json',
  origin: '*',
};

function isWikipediaImageResponse(
  value: unknown
): value is WikipediaImageResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const data = value as Record<string, unknown>;

  if (typeof data.query !== 'object' || data.query === null) {
    return false;
  }

  const query = data.query as Record<string, unknown>;

  if (typeof query.pages !== 'object' || query.pages === null) {
    return false;
  }

  return true;
}

function isWikipediaParseResponse(
  value: unknown
): value is WikipediaParseResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const data = value as Record<string, unknown>;

  if (typeof data.parse !== 'object' || data.parse === null) {
    return false;
  }

  const parse = data.parse as Record<string, unknown>;

  if (typeof parse.wikitext !== 'object' || parse.wikitext === null) {
    return false;
  }

  const wikitext = parse.wikitext as Record<string, unknown>;

  return typeof wikitext['*'] === 'string';
}

export async function fetchImageUrl(fileName: string): Promise<string> {
  const imageParams = {
    action: 'query',
    titles: 'File:' + fileName,
    prop: 'imageinfo',
    iiprop: 'url',
    format: 'json',
    origin: '*',
  };

  const url = baseUrl + '?' + new URLSearchParams(imageParams).toString();
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('HTTP error: ' + res.status);
  }

  const data: unknown = await res.json();

  if (!isWikipediaImageResponse(data)) {
    throw new Error('Ungültige Antwort von Wikipedia');
  }

  const pages = data.query?.pages;

  if (pages === undefined || pages === null) {
    throw new Error('Ungültige Antwort von Wikipedia: keine pages');
  }

  const page = Object.values(pages)[0];

  if (page === undefined) {
    console.warn('keine Seite gefunden für:', fileName);
    return 'media/noImageFound.jpg';
  }

  const imageInfo = page.imageinfo;

  if (imageInfo === undefined || imageInfo.length === 0) {
    console.warn('kein Bild gefunden für:', fileName);
    return 'media/noImageFound.jpg';
  }

  return imageInfo[0].url;
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

  if (nameMatch === null || binomialMatch === null || imageMatch === null) {
    console.warn('unvollständiger bären-datensatz:', row);
    return null;
  }

  return {
    name: nameMatch[1],
    binomial: binomialMatch[1],
    fileName: imageMatch[1].trim().replace('File:', ''),
    range: null,
  };
}

export async function enrichBearWithImage(bear: Bear): Promise<Bear> {
  const image = await fetchImageUrl(bear.fileName);

  return {
    name: bear.name,
    binomial: bear.binomial,
    fileName: bear.fileName,
    image,
    range: bear.range,
  };
}

function bearToHtml(bear: Bear): string {
  return `
<div class="bear">
<img src="${bear.image}" alt="Image of ${bear.name}" style="width:200px; height:auto;">
    <p><b>${bear.name}</b> (${bear.binomial})</p>
<p>Range: ${bear.range ?? 'Unknown'}</p>
</div>`;
}

export async function insertBearsInDOM(
  bearPromises: Array<Promise<Bear>>
): Promise<void> {
  const results = await Promise.allSettled(bearPromises);

  const bears = results
    .filter(
      (result): result is PromiseFulfilledResult<Bear> =>
        result.status === 'fulfilled'
    )
    .map((result) => result.value);

  const moreBears = document.querySelector('.more-bears');

  if (moreBears === null) {
    console.error('element mit klasse "more-bears" nicht gefunden.');
    return;
  }

  moreBears.insertAdjacentHTML('beforeend', bears.map(bearToHtml).join(''));
}

export async function loadBears(): Promise<void> {
  try {
    const res = await fetch(
      baseUrl + '?' + new URLSearchParams(params).toString()
    );

    if (!res.ok) {
      throw new Error('HTTP error: ' + res.status);
    }

    const data: unknown = await res.json();

    if (!isWikipediaParseResponse(data)) {
      throw new Error('Ungültige Antwort von Wikipedia');
    }

    const wikitext = data.parse?.wikitext?.['*'];

    if (wikitext === undefined) {
      throw new Error('Wikipedia-Antwort enthält keinen Wikitext');
    }

    const bears = extractBears(wikitext);
    const enrichedBearPromises = bears.map(enrichBearWithImage);

    await insertBearsInDOM(enrichedBearPromises);
  } catch (err) {
    console.error('fehler beim Laden der bärendaten:', err);
  }
}
