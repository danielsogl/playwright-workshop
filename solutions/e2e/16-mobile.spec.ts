/**
 * Exercise 16 - Mobile and Responsive Testing Solution
 *
 * This test suite demonstrates mobile device emulation and responsive design testing.
 * Tests navigation patterns, layout changes, and touch interactions across different viewports.
 *
 * Key learning points:
 * - Use device emulation with Playwright's devices
 * - Test responsive layouts across viewports
 * - Handle touch interactions and mobile-specific features
 * - Use conditional testing based on device type
 *
 * Breakpoints der App (Tailwind): Hamburger-Menü unter `sm` (640px),
 * Desktop-Navigation ab `lg` (1024px), News-Grid 2 Spalten ab `md` (768px),
 * 3 Spalten ab `lg`.
 */

import { test, expect, devices } from '@playwright/test';
// Reuse aus Übung 9: NewsPage-POM zum Navigieren (Fallback wäre page.goto('/news/public')).
import { NewsPage } from '../pages/NewsPage';

// defaultBrowserType erzwingt einen neuen Worker und ist in test.use() innerhalb
// von describe nicht erlaubt – der Rest (Viewport, UA, hasTouch, isMobile) schon.
const { defaultBrowserType: _iphone, ...iPhone13 } = devices['iPhone 13'];
const { defaultBrowserType: _pixel, ...pixel5 } = devices['Pixel 5'];

// Berechnete grid-template-columns sind px-Werte, z.B. "394.656px 394.672px 394.656px"
const columns = (count: number) =>
  new RegExp(`^[\\d.]+px(?: [\\d.]+px){${count - 1}}$`);

test.describe('Exercise 16: Mobile and Responsive Testing', () => {
  test.describe('Responsive Navigation', () => {
    test('Desktop: shows normal navigation', async ({ page }) => {
      // Ensure desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');

      // Desktop navigation should be visible
      await expect(
        page.getByRole('navigation', { name: 'Main navigation', exact: true }),
      ).toBeVisible();

      // On desktop, mobile menu should be hidden
      await expect(
        page.getByRole('button', { name: 'Open menu' }),
      ).toBeHidden();

      // Navigation links are reachable
      await expect(
        page.getByRole('link', { name: 'Navigate to Public News' }),
      ).toBeVisible();
    });

    test('Mobile: shows hamburger menu', async ({ page }) => {
      // Mobiles Viewport, auch in Desktop-Projekten
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/');

      // Desktop navigation is hidden, mobile menu button is visible
      await expect(
        page.getByRole('navigation', { name: 'Main navigation', exact: true }),
      ).toBeHidden();
      const mobileMenuButton = page.getByRole('button', { name: 'Open menu' });
      await expect(mobileMenuButton).toBeVisible();

      // Click to open mobile menu
      await mobileMenuButton.click();

      const mobileMenu = page.getByRole('navigation', {
        name: 'Mobile navigation',
      });
      await expect(mobileMenu).toBeVisible();
      await expect(
        mobileMenu.getByRole('link', { name: 'Navigate to Public News' }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Close menu' }),
      ).toBeVisible();
    });
  });

  test.describe('News Grid Responsive Layout', () => {
    // Fester Feed (Offline-Daten) statt Live-RSS, damit das Grid schnell und stabil rendert
    test.beforeEach(async ({ page }) => {
      await page.route('**/api/news/public', (route) =>
        route.fulfill({ path: 'app/api/feed.json' }),
      );
    });

    test('Desktop: shows multi-column layout', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      // Reuse aus Übung 9: POM navigiert und wartet auf die News-Items.
      // Fallback ohne POM: await page.goto('/news/public');
      const newsPage = new NewsPage(page);
      await newsPage.goto();

      await expect(newsPage.newsFeed).toHaveCSS(
        'grid-template-columns',
        columns(3),
      );
    });

    test('Tablet: shows 2-column layout', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/news/public');

      // Wait for news items to load
      await expect(page.getByRole('article').first()).toBeVisible();

      await expect(page.getByRole('feed', { name: 'News articles' })).toHaveCSS(
        'grid-template-columns',
        columns(2),
      );
    });

    test('Mobile: shows single column layout', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/news/public');
      // Wait for news items to load
      await expect(page.getByRole('article').first()).toBeVisible();

      await expect(page.getByRole('feed', { name: 'News articles' })).toHaveCSS(
        'grid-template-columns',
        columns(1),
      );
    });
  });

  test.describe('Touch Interactions', () => {
    // tap() braucht hasTouch: true – das setzt die Device-Emulation.
    test.use({ ...iPhone13 });

    test('Mobile: touch interactions work correctly', async ({ page }) => {
      await page.goto('/');

      // Use tap instead of click for touch devices
      await page.getByRole('button', { name: 'Open menu' }).tap();

      const mobileMenu = page.getByRole('navigation', {
        name: 'Mobile navigation',
      });
      await mobileMenu
        .getByRole('link', { name: 'Navigate to Public News' })
        .tap();

      // Navigation occurred and the menu closed itself
      await expect(page).toHaveURL('/news/public');
      await expect(page.getByRole('article').first()).toBeVisible();
      await expect(mobileMenu).toBeHidden();
    });

    test('Mobile: scroll behavior works', async ({ page, browserName }) => {
      test.skip(
        browserName === 'webkit',
        'mouse.wheel wird in mobilem WebKit nicht unterstützt',
      );
      await page.goto('/news/public');
      // Wait for news items to load
      await expect(page.getByRole('article').first()).toBeVisible();

      // Get initial scroll position
      const initialScrollY = await page.evaluate(() => window.scrollY);

      // Scroll down
      await page.mouse.wheel(0, 500);

      // Scrollen passiert asynchron → pollen statt fester Wartezeit
      await expect
        .poll(() => page.evaluate(() => window.scrollY))
        .toBeGreaterThan(initialScrollY);
    });
  });

  test.describe('Cross-Device Compatibility', () => {
    test.describe('iPhone 13', () => {
      test.use({ ...iPhone13 });

      test('iPhone 13: complete user journey', async ({ page }) => {
        // Test complete mobile journey
        await page.goto('/');

        // Navigate to news via the call-to-action on the homepage
        await page.getByRole('link', { name: 'View Public News' }).tap();
        await expect(page).toHaveURL('/news/public');

        // Verify news items are visible and appropriately sized
        const newsItems = page.getByRole('article');
        await expect(newsItems.first()).toBeVisible();

        // Check touch target sizes (minimum 44x44px for accessibility)
        const box = await newsItems.first().boundingBox();
        expect(box?.height).toBeGreaterThan(44);
        expect(box?.width).toBeGreaterThan(44);
      });
    });

    test.describe('Pixel 5', () => {
      test.use({ ...pixel5 });

      test('Pixel 5: navigation and search', async ({ page }) => {
        await page.goto('/news/public');
        // Wait for news items to load
        await expect(page.getByRole('article').first()).toBeVisible();

        const searchInput = page.getByRole('textbox', {
          name: 'Search news articles',
        });

        // Test search on mobile – ohne Treffer ist das Ergebnis deterministisch
        await searchInput.tap();
        await searchInput.fill('zzz-kein-treffer-xyz');

        await expect(page.getByText('0 articles found')).toBeVisible();
        await expect(page.getByRole('article')).toHaveCount(0);
      });
    });
  });

  test.describe('Viewport Breakpoint Testing', () => {
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop-large' },
      { width: 1280, height: 720, name: 'desktop' },
      { width: 1024, height: 768, name: 'tablet-landscape' },
      { width: 768, height: 1024, name: 'tablet-portrait' },
      { width: 414, height: 896, name: 'mobile-large' },
      { width: 375, height: 667, name: 'mobile' },
      { width: 320, height: 568, name: 'mobile-small' },
    ];

    for (const viewport of viewports) {
      test(`${viewport.name}: layout consistency`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto('/');

        // Check that main content is visible
        await expect(page.getByRole('main')).toBeVisible();

        // Check that page renders without horizontal scroll
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20); // Allow 20px buffer

        // Check navigation is accessible: homepage link is always visible
        await expect(
          page.getByRole('link', { name: 'Go to homepage' }),
        ).toBeVisible();
      });
    }
  });

  test.describe('Orientation Changes', () => {
    test('handles orientation change gracefully', async ({
      page,
      isMobile,
    }) => {
      test.skip(!isMobile, 'Nur auf Mobile-Projekten sinnvoll');

      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/news/public');
      // Wait for news items to load
      await expect(page.getByRole('article').first()).toBeVisible();

      const portraitItemCount = await page.getByRole('article').count();

      // Switch to landscape
      await page.setViewportSize({ width: 667, height: 375 });

      // Content should still be accessible
      await expect(page.getByRole('article')).toHaveCount(portraitItemCount);

      // Layout might change but content should remain
      await expect(
        page.getByRole('navigation', { name: 'Main navigation bar' }),
      ).toBeVisible();
    });
  });
});
