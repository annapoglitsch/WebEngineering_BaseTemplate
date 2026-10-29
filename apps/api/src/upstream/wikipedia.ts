import { z } from 'zod';
import {
  UpstreamError,
  UpstreamTimeoutError,
} from '../errors/upStreamErrors.js';

const baseUrl = process.env.WIKIPEDIA_BASE_URL ?? 'https://en.wikipedia.org';

const userAgent =
  process.env.USER_AGENT ?? 'BearApp/1.0 (mailto:deine-email@example.com)';

const ParseSchema = z.object({
  parse: z.object({
    wikitext: z.union([z.string(), z.object({ '*': z.string() })]),
  }),
});

const ImageSchema = z.object({
  query: z.object({
    pages: z.record(
      z.string(),
      z.object({
        title: z.string(),
        imageinfo: z.array(z.object({ url: z.string().url() })).optional(),
      })
    ),
  }),
});

async function requestWikipedia(url: URL): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': userAgent },
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new UpstreamTimeoutError('Wikipedia request timed out', {
        cause: error,
      });
    }

    throw new UpstreamError('Wikipedia is unreachable', { cause: error });
  }

  if (!response.ok) {
    throw new UpstreamError(`Wikipedia HTTP ${response.status}`);
  }

  return response;
}

export async function fetchWikitext(): Promise<string> {
  const url = new URL('/w/api.php', baseUrl);

  url.search = new URLSearchParams({
    action: 'parse',
    page: 'List_of_ursids',
    prop: 'wikitext',
    section: '3',
    format: 'json',
    formatversion: '2',
  }).toString();

  const response = await requestWikipedia(url);

  let json: unknown;

  try {
    json = await response.json();
  } catch (error) {
    throw new UpstreamError('Wikipedia returned invalid JSON', {
      cause: error,
    });
  }

  let parsed: z.infer<typeof ParseSchema>;

  try {
    parsed = ParseSchema.parse(json);
  } catch (error) {
    throw new UpstreamError('Wikipedia returned an unexpected response shape', {
      cause: error,
    });
  }

  const text = parsed.parse.wikitext;

  return typeof text === 'string' ? text : text['*'];
}

export async function fetchImageUrls(
  fileNames: string[]
): Promise<Map<string, string>> {
  const images = new Map<string, string>();

  if (fileNames.length === 0) return images;

  const url = new URL('/w/api.php', baseUrl);

  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    prop: 'imageinfo',
    iiprop: 'url',
    titles: fileNames.map((name) => `File:${name}`).join('|'),
  }).toString();

  const response = await requestWikipedia(url);

  let json: unknown;

  try {
    json = await response.json();
  } catch (error) {
    throw new UpstreamError('Wikipedia returned invalid image JSON', {
      cause: error,
    });
  }

  let parsed: z.infer<typeof ImageSchema>;

  try {
    parsed = ImageSchema.parse(json);
  } catch (error) {
    throw new UpstreamError(
      'Wikipedia returned an unexpected image response shape',
      { cause: error }
    );
  }

  for (const page of Object.values(parsed.query.pages)) {
    const imageUrl = page.imageinfo?.[0]?.url;

    if (imageUrl) {
      images.set(normalizeFileName(page.title), imageUrl);
    }
  }

  return images;
}

function normalizeFileName(value: string): string {
  return value
    .replace(/^File:/i, '')
    .replaceAll('_', ' ')
    .trim()
    .toLowerCase();
}

export { normalizeFileName };
