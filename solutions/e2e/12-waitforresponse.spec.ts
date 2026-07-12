import { test, expect } from '@playwright/test';
// Reuse aus Übung 11: die Mock-Daten kommen aus der geteilten Datei statt inline.
import { mockSearchFeed as mockFeed } from './mocks/news-mocks';

// Musterlösung zu Übung 12 – API Mocking mit waitForResponse
test.describe('API Mocking mit waitForResponse', () => {
  test('empfängt und verarbeitet gemockte Response', async ({ page }) => {
    // 1. API mocken
    await page.route('**/api/news/public', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockFeed),
      });
    });

    // 2. Response abfangen (vor der Navigation!)
    const responsePromise = page.waitForResponse('**/api/news/public');

    // 3. Navigieren
    await page.goto('/news/public');

    // 4. Netzwerkantwort prüfen
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.items).toHaveLength(1);
    expect(data.items[0].title).toBe('Gemockte News');

    // 5. Abgleich mit dem UI
    const articles = page.getByRole('article');
    await expect(articles).toHaveCount(1);
    await expect(articles.first()).toContainText('Gemockte News');
  });
});
