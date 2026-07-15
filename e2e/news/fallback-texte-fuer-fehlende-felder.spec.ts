// spec: specs/news-public.md
// seed: seed.spec.ts

import { expect, test } from '@/e2e/fixtures/base.fixture';
import type { RSSFeedResponse } from '@/types/rss';

test.describe('Happy Path & Artikel-Darstellung', () => {
  test('Fallback-Texte für fehlende Beschreibung und fehlendes Datum', async ({ publicNewsPage, page }) => {
    // 1. Mocke /api/news/public mit einem Item OHNE description-Feld und OHNE pubDate-Feld
    await page.route('**/api/news/public', (route) => {
      route.fulfill({
        status: 200,
        json: {
          items: [
            {
              title: 'Workshop Test Article - No Metadata',
              link: 'https://example.com/no-metadata',
              category: 'Technology',
              source: 'Mock Source',
            },
          ],
        } satisfies RSSFeedResponse,
      });
    });

    // 2. Navigiere zu /news/public
    await publicNewsPage.navigateTo();
    const article = publicNewsPage.item(0);
    await expect(article.root).toBeVisible();

    // 3. Prüfe Beschreibung und Datum der Karte
    await expect(article.root.getByText('No description available')).toBeVisible();
    await expect(article.root.getByText('Date unavailable')).toBeVisible();
  });
});
