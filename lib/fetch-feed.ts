import Parser from 'rss-parser';

const parser = new Parser();

// ponytail: fixed per-feed timeout, make it an env var if a slow feed ever needs more
const FEED_TIMEOUT_MS = 5000;

/**
 * Loads an RSS/Atom feed via fetch instead of parser.parseURL():
 * no deprecated url.parse() and a timeout, so one hanging feed cannot
 * block the whole response. Errors keep the "Status code NNN" format
 * that /api/rss parses.
 */
export async function fetchFeed(url: string) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'rss-parser' },
    signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
  });

  if (!res.ok) throw new Error(`Status code ${res.status}`);

  return parser.parseString(await res.text());
}
