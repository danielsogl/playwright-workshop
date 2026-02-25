import type { RSSFeedResponse } from "@/types/rss";
import { test, expect } from "@playwright/test";

test.describe("News API", () => {
  test('should load news items', async ({ page }) => {
    const newsResponse = page.waitForResponse('/api/news/public');

    await page.goto("/news/public");

    const response = await newsResponse;
    const data = await response.json() satisfies RSSFeedResponse;

    const newsList = page.getByRole('list', { name: 'News articles' });
    const items = newsList.getByRole('listitem');
    await expect(items).toHaveCount(data.items.length);
    expect(response.status()).toBe(200);
  });

  test('should handle empty response', async ({ page }) => {
    await page.route('/api/news/public', (route) => route.fulfill({
      json: { items: [] } satisfies RSSFeedResponse
    }));

    await page.goto("/news/public");

    const newsItems = page.getByRole('list', { name: 'News articles' });
    const items = newsItems.getByRole('listitem');
    await expect(items).toHaveCount(0);
  });

  test('should handle API error', async ({ page }) => {
    await page.route('/api/news/public', (route) => route.fulfill({
      status: 500,
      json: { error: 'Internal Server Error' }
    }));

    await page.goto("/news/public");

    const errorMessage = page.getByText('Failed to load RSS feeds');
    await expect(errorMessage).toBeVisible();
  });

  test('should show loading state', async ({ page }) => {
    await page.route('/api/news/public', async (route) => {
      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          await route.continue();
          resolve();
        }, 2_000);
      });
    });

    await page.goto("/news/public");

    const loadingIndicator = page.getByText('Loading news feed…');
    await expect(loadingIndicator).toBeVisible();
  });
});