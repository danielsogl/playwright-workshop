/**
 * Exercise 11 - API Mocking Solution
 *
 * This test suite demonstrates comprehensive API mocking techniques with Playwright.
 * Covers success states, error handling, loading states, and dynamic mocking based on requests.
 *
 * Key learning points:
 * - Mock API responses before page navigation
 * - Test different response states (success, error, empty, loading)
 * - Use realistic mock data for better testing
 * - Handle dynamic mocking with a flag the test switches at runtime
 */

import { test, expect } from '@playwright/test';
import { mockNewsData } from './mocks/news-mocks';

test.describe('Exercise 11: API Mocking', () => {
  test('shows mocked news data successfully', async ({ page }) => {
    // Mock API before the page loads - this is crucial for proper interception.
    // `json` serializes the body and sets the content-type automatically.
    await page.route('**/api/news/public', async (route) => {
      await route.fulfill({ json: mockNewsData.success });
    });

    await page.goto('/news/public');

    // Exactly the mocked articles are rendered
    await expect(page.getByRole('article')).toHaveCount(
      mockNewsData.success.items.length,
    );

    // Verify specific content from our mock data
    await expect(page.getByText('Test Technology News')).toBeVisible();
    await expect(page.getByText('Test Business News')).toBeVisible();
  });

  test('shows error message when API fails', async ({ page }) => {
    // Mock API error response
    await page.route('**/api/news/public', async (route) => {
      await route.fulfill({
        status: 500,
        json: { error: 'Internal Server Error' },
      });
    });

    await page.goto('/news/public');

    // Error UI of the app (the name avoids matching Next.js' route announcer)
    await expect(
      page.getByRole('alert').filter({ hasText: 'Failed to load RSS feeds' }),
    ).toBeVisible();

    // News list should not be rendered at all
    await expect(
      page.getByRole('feed', { name: 'News articles' }),
    ).toBeHidden();
  });

  test('shows empty state when no news available', async ({ page }) => {
    // Mock empty response
    await page.route('**/api/news/public', async (route) => {
      await route.fulfill({ json: mockNewsData.empty });
    });

    await page.goto('/news/public');

    // The app has no dedicated empty-state message, only the result counter
    await expect(page.getByText('0 articles found')).toBeVisible();
    await expect(page.getByRole('article')).toHaveCount(0);
  });

  test('shows loading state during API call', async ({ page }) => {
    // Mock with deliberate delay to test loading state
    await page.route('**/api/news/public', async (route) => {
      // Wait 2 seconds to simulate slow API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({ json: mockNewsData.success });
    });

    // goto() waits for the load event, not for the SWR fetch
    await page.goto('/news/public');

    const loading = page.getByRole('status', { name: 'Loading news feed' });
    await expect(loading).toBeVisible();

    // Loading should disappear and data should be visible
    await expect(loading).toBeHidden();
    await expect(page.getByRole('article')).toHaveCount(
      mockNewsData.success.items.length,
    );
  });

  test('filters mocked news via search', async ({ page }) => {
    // The search on /news/public filters client-side, so a single mock is
    // enough: every search result comes from these deterministic items.
    await page.route('**/api/news/public', async (route) => {
      await route.fulfill({ json: mockNewsData.success });
    });

    await page.goto('/news/public');

    const newsItems = page.getByRole('article');
    await expect(newsItems).toHaveCount(mockNewsData.success.items.length);

    const searchInput = page.getByRole('textbox', {
      name: 'Search news articles',
    });

    // Title and description are searched
    await searchInput.fill('business');
    await expect(newsItems).toHaveCount(1);
    await expect(newsItems).toContainText('Test Business News');

    // Search for something else
    await searchInput.fill('nonexistent');
    await expect(newsItems).toHaveCount(0);

    // Clear search, all mocked items are back
    await searchInput.clear();
    await expect(newsItems).toHaveCount(mockNewsData.success.items.length);
  });

  test('handles network timeout gracefully', async ({ page }) => {
    // Never fulfill the request to simulate a hanging API
    await page.route('**/api/news/public', () => {});

    await page.goto('/news/public');

    // The app has no client-side timeout: it keeps showing the loading state
    await expect(
      page.getByRole('status', { name: 'Loading news feed' }),
    ).toBeVisible();
    await expect(page.getByRole('article')).toHaveCount(0);
  });

  test('mocks rate limiting response', async ({ page }) => {
    let rateLimited = false;

    await page.route('**/api/news/public', async (route) => {
      if (route.request().method() !== 'GET') {
        // Everything else goes on to other handlers or the network
        await route.fallback();
      } else if (rateLimited) {
        await route.fulfill({
          status: 429,
          json: { error: 'Too Many Requests' },
        });
      } else {
        await route.fulfill({ json: mockNewsData.success });
      }
    });

    await page.goto('/news/public');

    // Initial load should work
    await expect(page.getByRole('article')).toHaveCount(
      mockNewsData.success.items.length,
    );

    // From now on every request is rate limited
    rateLimited = true;
    await page.reload();

    await expect(
      page.getByRole('alert').filter({ hasText: 'Failed to load RSS feeds' }),
    ).toBeVisible();
    await expect(page.getByRole('article')).toHaveCount(0);
  });
});
