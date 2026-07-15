// spec: specs/news-public.md
// seed: seed.spec.ts

import { test, expect } from '@/e2e/fixtures/base.fixture';
import type { RSSFeedResponse } from '@/types/rss';

test.describe('Happy Path & Artikel-Darstellung', () => {
  test('Kategorie-Chip wird nur angezeigt wenn eine Kategorie vorhanden ist', async ({ publicNewsPage, page }) => {
    // 1. Mocke /api/news/public mit zwei Items: eines mit category='Technology', eines OHNE category-Feld
    await page.route('**/api/news/public', (route) => {
      route.fulfill({
        status: 200,
        json: {
          items: [
            {
              title: 'Artikel mit Kategorie',
              link: 'https://example.com/mit-kategorie',
              description: 'Beschreibung mit Kategorie',
              pubDate: '2026-07-15T10:00:00.000Z',
              category: 'Technology',
              source: 'Mock Source',
              isoDate: '2026-07-15T10:00:00.000Z',
            },
            {
              title: 'Artikel ohne Kategorie',
              link: 'https://example.com/ohne-kategorie',
              description: 'Beschreibung ohne Kategorie',
              pubDate: '2026-07-15T09:00:00.000Z',
              source: 'Mock Source',
              isoDate: '2026-07-15T09:00:00.000Z',
            },
          ],
        } satisfies RSSFeedResponse,
      });
    });

    // 2. Navigiere zu /news/public
    await publicNewsPage.navigateTo();

    await expect(publicNewsPage.items()).toHaveCount(2);

    // 3. Prüfe die Chips beider Karten
    const itemWithCategory = publicNewsPage.itemByTitle('Artikel mit Kategorie');
    const itemWithoutCategory = publicNewsPage.itemByTitle('Artikel ohne Kategorie');
    const chips = (item: typeof itemWithCategory) => item.root.locator('[data-slot="chip"], .chip');

    await expect(chips(itemWithCategory)).toHaveCount(2);
    await expect(chips(itemWithCategory)).toHaveText(['Mock Source', 'Technology']);

    await expect(chips(itemWithoutCategory)).toHaveCount(1);
    await expect(chips(itemWithoutCategory)).toHaveText(['Mock Source']);
  });
});
