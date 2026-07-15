// spec: specs/news-public.md
// seed: seed.spec.ts
import { test, expect } from '@playwright/test';

import { PublicNewsPage } from '@/e2e/pom/public-news.pom';

test.describe('Happy Path & Artikel-Darstellung', () => {
  test('HTML-Tags in der Beschreibung werden entfernt', async ({ page }) => {
    // 1. Mocke /api/news/public mit einem Item, dessen description HTML enthält (z.B. '<p>Hallo <b>Welt</b></p>')
    await page.route('**/api/news/public', (route) => {
      route.fulfill({
        status: 200,
        json: {
          items: [
            {
              title: 'Artikel mit HTML in der Beschreibung',
              description: '<p>Hallo <b>Welt</b></p>',
              link: 'https://example.com/html-in-description',
              source: 'Mock Source',
              category: 'Technology',
              pubDate: '2026-01-01T10:00:00.000Z',
              isoDate: '2026-01-01T10:00:00.000Z',
            },
          ],
        },
      });
    });

    // 2. Navigiere zu /news/public
    const publicNewsPage = new PublicNewsPage(page);
    await publicNewsPage.navigateTo();

    const item = publicNewsPage.item(0);

    await expect(item.root).toBeVisible();
    await expect(item.root.locator('p')).toHaveText('Hallo Welt');
  });
});
