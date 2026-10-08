/**
 * Exercise 15 - Visual Regression Testing Solution
 *
 * This test suite demonstrates visual regression testing with Playwright's screenshot capabilities.
 * Tests visual consistency across different states, themes, and viewports.
 *
 * Key learning points:
 * - Capture and compare screenshots for visual regression testing
 * - Handle dynamic content with masking
 * - Test across different themes and responsive breakpoints
 * - Configure screenshot options for consistent results
 *
 * toHaveScreenshot stabilisiert selbst: Animationen sind standardmäßig
 * deaktiviert und es wird gewartet, bis zwei Screenshots identisch sind.
 * Daher keine networkidle-/Timeout-Wartezeiten, sondern Web-First-Assertions
 * auf den erwarteten Inhalt vor dem Screenshot.
 */

import { test, expect, type Page } from '@playwright/test';
// Reuse aus Übung 9: NewsPage-POM zum Navigieren (Fallback wäre page.goto('/news/public')).
import { NewsPage } from './pages/NewsPage';

// Die Navbar zeigt „Loading…", bis die Session geladen ist. Screenshots mit
// Navbar erst danach – sonst ist die Baseline mal „Loading…", mal „Sign In".
async function gotoWithSession(page: Page, url: string) {
  await page.goto(url);
  await expect(
    page.getByRole('button', { name: 'Loading authentication status' }),
  ).toBeHidden();
}

test.describe('Exercise 15: Visual Regression Testing', () => {
  // Feste Testdaten statt Live-RSS: derselbe Offline-Feed, den die App mit
  // RSS_OFFLINE_MODE=true ausliefert (Mocking aus Übung 11). Tests mit eigenem
  // page.route() überschreiben ihn – spätere Routen haben Vorrang.
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/news/public', (route) =>
      route.fulfill({ path: 'app/api/feed.json' }),
    );
  });

  test.describe('Homepage Visual Tests', () => {
    test('Homepage full page screenshot', async ({ page }) => {
      await gotoWithSession(page, '/');

      await expect(page).toHaveScreenshot('homepage.png', {
        fullPage: true,
        // Toleranz pro Pixel im YIQ-Farbraum (0 = strikt, 1 = tolerant)
        threshold: 0.3,
      });
    });

    test('Homepage hero section', async ({ page }) => {
      await gotoWithSession(page, '/');

      // Screenshot of just the header section (<header> = role "banner")
      await expect(page.getByRole('banner')).toHaveScreenshot(
        'homepage-hero.png',
      );
    });

    test('Navigation bar visual consistency', async ({ page }) => {
      await gotoWithSession(page, '/');

      const navigation = page.getByRole('navigation', {
        name: 'Main navigation bar',
      });
      await expect(navigation).toHaveScreenshot('navigation-bar.png');
    });
  });

  test.describe('News Feed Visual Tests', () => {
    test('News feed layout screenshot', async ({ page }) => {
      // Reuse aus Übung 9: POM navigiert und wartet auf die News-Items.
      // Fallback ohne POM: await page.goto('/news/public');
      const newsPage = new NewsPage(page);
      await newsPage.goto();

      // Take screenshot of the news grid
      await expect(newsPage.newsFeed).toHaveScreenshot('news-grid.png');
    });

    test('Individual news card with masked dynamic content', async ({
      page,
    }) => {
      await page.goto('/news/public');

      const firstNewsCard = page.getByRole('article').first();
      await expect(firstNewsCard).toBeVisible();

      // Mask dynamic content like the publish date ("13. September 2026")
      await expect(firstNewsCard).toHaveScreenshot('news-card.png', {
        mask: [
          firstNewsCard.getByText(/^\d{1,2}\. \S+ \d{4}$|^Date unavailable$/),
        ],
        maskColor: '#FF00FF', // Magenta mask color
      });
    });

    test('Empty state visual test', async ({ page }) => {
      // Mock empty response
      await page.route('**/api/news/public', (route) =>
        route.fulfill({ json: { items: [] } }),
      );

      await gotoWithSession(page, '/news/public');
      await expect(page.getByText('0 articles found')).toBeVisible();

      await expect(page).toHaveScreenshot('news-empty-state.png', {
        fullPage: true,
      });
    });

    test('Error state visual test', async ({ page }) => {
      // Mock error response
      await page.route('**/api/news/public', (route) =>
        route.fulfill({
          status: 500,
          json: { error: 'Internal Server Error' },
        }),
      );

      await gotoWithSession(page, '/news/public');
      await expect(
        page.getByRole('alert').filter({ hasText: 'Failed to load RSS feeds' }),
      ).toBeVisible();

      await expect(page).toHaveScreenshot('news-error-state.png', {
        fullPage: true,
      });
    });
  });

  test.describe('Theme Visual Tests', () => {
    // Die App folgt dem System-Theme, Playwright emuliert standardmäßig Light
    // Mode. Der Switch-Name steht erst nach der Hydration fest – darauf warten
    // die Web-First-Locators automatisch.
    test('Light and dark mode', async ({ page }) => {
      await gotoWithSession(page, '/');
      await expect(page.locator('html')).toHaveClass(/light/);
      await expect(page).toHaveScreenshot('light-mode.png', { fullPage: true });

      await page.getByRole('switch', { name: 'Switch to dark mode' }).click();
      await expect(page.locator('html')).toHaveClass(/dark/);
      await expect(page).toHaveScreenshot('dark-mode.png', { fullPage: true });
    });

    test('Theme toggle button states', async ({ page }) => {
      await page.goto('/');

      const toDark = page.getByRole('switch', { name: 'Switch to dark mode' });
      await expect(toDark).toHaveScreenshot('theme-toggle-before.png');

      await toDark.click();

      await expect(
        page.getByRole('switch', { name: 'Switch to light mode' }),
      ).toHaveScreenshot('theme-toggle-after.png');
    });
  });

  test.describe('Responsive Visual Tests', () => {
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' },
    ];

    for (const viewport of viewports) {
      test(`Homepage ${viewport.name} viewport`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await gotoWithSession(page, '/');

        // Next-Dev-Overlay (z. B. "Compiling…"-Badge) ausblenden
        await page.addStyleTag({
          content: 'nextjs-portal { display: none !important; }',
        });

        await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
          fullPage: true,
        });
      });
    }
  });

  test.describe('Cross-Browser Visual Tests', () => {
    test('Cross-browser consistency', async ({ page }) => {
      await gotoWithSession(page, '/news/public');
      await expect(page.getByRole('article').first()).toBeVisible();

      await expect(page).toHaveScreenshot('news-page-cross-browser.png', {
        fullPage: true,
        threshold: 0.3,
      });
    });

    test('Navigation consistency across browsers', async ({ page }) => {
      await gotoWithSession(page, '/');

      const navigation = page.getByRole('navigation', {
        name: 'Main navigation bar',
      });
      await expect(navigation).toHaveScreenshot(
        'navigation-cross-browser.png',
        {
          threshold: 0.3,
        },
      );
    });
  });

  test.describe('Interactive State Visual Tests', () => {
    test('Button hover states', async ({ page }) => {
      await page.goto('/');

      // Primärer Call-to-Action auf der Startseite (Link im Button-Stil)
      const button = page.getByRole('link', { name: 'View Public News' });

      // Screenshot before hover
      await expect(button).toHaveScreenshot('button-normal.png');

      // Hover and screenshot (Transitions spult toHaveScreenshot vor)
      await button.hover();
      await expect(button).toHaveScreenshot('button-hover.png');
    });

    test('Form input focus states', async ({ page }) => {
      await page.goto('/auth/signin');

      const input = page.getByRole('textbox', {
        name: 'Email address for sign in',
      });

      // Screenshot before focus
      await expect(input).toHaveScreenshot('input-normal.png');

      // Focus and screenshot
      await input.focus();
      await expect(input).toBeFocused();
      await expect(input).toHaveScreenshot('input-focus.png');
    });
  });

  test.describe('Loading State Visual Tests', () => {
    test('Loading state visual appearance', async ({ page }) => {
      // Response zurückhalten, bis der Loading-Screenshot gemacht ist –
      // deterministisch statt eines festen Delays.
      let releaseResponse!: () => void;
      const responseReleased = new Promise<void>((resolve) => {
        releaseResponse = resolve;
      });

      await page.route('**/api/news/public', async (route) => {
        await responseReleased;
        await route.fulfill({
          json: {
            items: [
              {
                title: 'Test News',
                description: 'Test description',
                link: 'https://example.com',
                pubDate: new Date().toISOString(),
              },
            ],
          },
        });
      });

      await gotoWithSession(page, '/news/public');

      await expect(
        page.getByRole('status', { name: 'Loading news feed' }),
      ).toBeVisible();
      await expect(page).toHaveScreenshot('loading-state.png');

      releaseResponse();
      await expect(page.getByRole('article')).toHaveCount(1);
    });
  });

  test.describe('Component-Specific Visual Tests', () => {
    test('Search component visual states', async ({ page }) => {
      await page.goto('/news/public');

      const searchInput = page.getByRole('textbox', {
        name: 'Search news articles',
      });

      // Empty search state
      await expect(searchInput).toHaveScreenshot('search-empty.png');

      // With text
      await searchInput.fill('technology');
      await expect(searchInput).toHaveValue('technology');
      await expect(searchInput).toHaveScreenshot('search-with-text.png');

      // Suche + Kategorie-Filter als Ganzes
      await expect(
        page.getByRole('search', { name: 'News filter options' }),
      ).toHaveScreenshot('search-results-context.png');
    });
  });
});
