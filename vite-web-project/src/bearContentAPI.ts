// Fetching bear data
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
  if (!pages) {
    throw new Error('Ungültige Antwort von Wikipedia: keine pages');
  }
  const page = Object.values(pages)[0];
  if (!page) {
    console.warn('keine Seite gefunden für:', fileName);
    return 'media/noImageFound.jpg';
  }
  if (!page.imageinfo?.[0]) {
    console.warn('kein Bild gefunden für:', fileName);
    return 'media/noImageFound.jpg';
  }
  return page.imageinfo[0].url;
}

export function extractBears(wikitext: string): Bear[] {
  return wikitext
    .split('{{Species table/row')
    .slice(1)
    .map(parseBearRow)
    .filter((bear) => bear !== null);
}

export function parseBearRow(row: string): Bear | null {
  const nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
  const binomialMatch = row.match(/\|binomial=(.*?)(?:\n|\|)/);
  const imageMatch = row.match(/\|image=(.*?)(?:\n|\|)/);

  if (!nameMatch || !binomialMatch || !imageMatch) {
    // unvollständige Daten -> mag ich halt nicht
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

export async function enrichBearWithImage(bear: Bear) {
  const image = await fetchImageUrl(bear.fileName);
  return {
    name: bear.name,
    binomial: bear.binomial,
    fileName: bear.fileName,
    image,
    range: bear.range,
  };
}

function bearToHtml(bear: Bear) {
  return `
        <div class="bear">
            <img src="${bear.image}" alt="Image of ${bear.name}" style="width:200px; height:auto;">
            <p><b>${bear.name}</b> (${bear.binomial})</p>
            <p>Range: ${bear.range ?? 'Unknown'}</p>
        </div>`;
}

export async function insertBearsInDOM(bearPromises: Array<Promise<Bear>>) {
  const results = await Promise.allSettled(bearPromises);
  const bears = results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);
  const moreBears = document.querySelector('.more-bears');

  if (!moreBears) {
    console.error('element mit klasse "more-bears" nicht gefunden.');
    return;
  }

  moreBears.insertAdjacentHTML('beforeend', bears.map(bearToHtml).join(''));
}

export async function loadBears() {
  try {
    const res = await fetch(
      baseUrl + '?' + new URLSearchParams(params).toString()
    );
    const data = await res.json();

    const bears = extractBears(data.parse.wikitext['*']);
    const enrichedBearPromises = bears.map(enrichBearWithImage);
    await insertBearsInDOM(enrichedBearPromises);
  } catch (err) {
    console.error('fehler beim Laden der bärendaten:', err);
  }
}
