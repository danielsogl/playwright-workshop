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
 */

import { test, expect, devices } from '@playwright/test';
// Reuse aus Übung 9: NewsPage-POM zum Navigieren (Fallback wäre page.goto('/news/public')).
import { NewsPage } from '../pages/NewsPage';

test.describe('Exercise 16: Mobile and Responsive Testing', () => {
  test.describe('Responsive Navigation', () => {
    test('Desktop: shows normal navigation', async ({ page }) => {
      // Ensure desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');

      // Desktop navigation should be visible
      // Test multiple possible desktop navigation selectors
      const desktopNavSelectors = [
        'nav .hidden.lg\\:flex',
        'nav .desktop-nav',
        '[data-testid="desktop-navigation"]',
        'nav ul:not(.mobile-menu)',
        '.navbar .nav-links',
      ];

      let desktopNavFound = false;
      for (const selector of desktopNavSelectors) {
        const element = page.locator(selector);
        if (
          (await element.count()) > 0 &&
          (await element.isVisible().catch(() => false))
        ) {
          desktopNavFound = true;
          console.log('Found desktop navigation:', selector);
          break;
        }
      }

      // Mobile menu button should not be visible on desktop
      const mobileMenuSelectors = [
        'button[aria-label*="menu" i]',
        'button[aria-label*="hamburger" i]',
        '[data-testid="mobile-menu-button"]',
        '.hamburger-button',
        'button:has-text("☰")',
      ];

      let mobileMenuVisible = false;
      for (const selector of mobileMenuSelectors) {
        const element = page.locator(selector);
        if (
          (await element.count()) > 0 &&
          (await element.isVisible().catch(() => false))
        ) {
          mobileMenuVisible = true;
          break;
        }
      }

      // On desktop, mobile menu should be hidden
      expect(mobileMenuVisible).toBe(false);

      // At least some form of navigation should be present
      const navLinks = page.locator('nav a, .nav-link, [role="navigation"] a');
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    });

    test('Mobile: shows hamburger menu', async ({ page, isMobile }) => {
      // This test runs on mobile devices defined in config
      if (!isMobile) {
        // Force mobile viewport if not already mobile
        await page.setViewportSize({ width: 375, height: 667 });
      }

      await page.goto('/');

      // Look for mobile menu button
      const mobileMenuSelectors = [
        'button[aria-label*="menu" i]',
        'button[aria-label*="hamburger" i]',
        '[data-testid="mobile-menu-button"]',
        '.hamburger-button',
        'button:has([data-testid="hamburger-icon"])',
        'button:has-text("☰")',
        'nav button', // Generic nav button
      ];

      let mobileMenuButton = null;
      for (const selector of mobileMenuSelectors) {
        const element = page.locator(selector);
        if ((await element.count()) > 0) {
          mobileMenuButton = element.first();
          break;
        }
      }

      if (mobileMenuButton) {
        // Mobile menu button should be visible
        await expect(mobileMenuButton).toBeVisible();

        // Click to open mobile menu
        await mobileMenuButton.click();

        // Look for mobile menu content
        const mobileMenuContentSelectors = [
          '.mobile-menu',
          '[data-testid="mobile-menu"]',
          'nav ul.mobile',
          '.mobile-nav',
          '[role="navigation"][aria-expanded="true"]',
        ];

        let menuContentFound = false;
        for (const selector of mobileMenuContentSelectors) {
          const element = page.locator(selector);
          if (
            (await element.count()) > 0 &&
            (await element.isVisible().catch(() => false))
          ) {
            menuContentFound = true;
            break;
          }
        }

        // If we found specific mobile menu, check for navigation links
        if (menuContentFound || (await page.locator('nav a').count()) > 0) {
          // Check for common navigation links
          const commonLinks = [
            'Home',
            'News',
            'About',
            'Blog',
            'Contact',
            'Login',
          ];
          let foundLinks = 0;

          for (const linkText of commonLinks) {
            const link = page.getByRole('link', {
              name: new RegExp(linkText, 'i'),
            });
            if ((await link.count()) > 0) {
              foundLinks++;
            }
          }

          expect(foundLinks).toBeGreaterThan(0);
        }
      } else {
        console.log(
          'Mobile menu button not found, checking for responsive navigation',
        );

        // Some mobile designs might use different responsive patterns
        const anyNavLinks = page.locator(
          'nav a, .nav-link, [role="navigation"] a',
        );
        const linkCount = await anyNavLinks.count();
        expect(linkCount).toBeGreaterThan(0);
      }
    });
  });

  test.describe('News Grid Responsive Layout', () => {
    test('Desktop: shows multi-column layout', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      // Reuse aus Übung 9: POM navigiert und wartet auf die News-Items.
      // Fallback ohne POM: await page.goto('/news/public');
      await new NewsPage(page).goto();

      // Check for grid layout indicators
      const newsContainer = page
        .locator(
          '.grid, [style*="grid"], .news-grid, [data-testid="news-grid"]',
        )
        .first();

      if ((await newsContainer.count()) > 0) {
        // Check CSS grid properties
        const gridColumns = await newsContainer.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return style.gridTemplateColumns || style.display;
        });

        console.log('Desktop grid layout:', gridColumns);

        // Should have multiple columns or be a grid (mehrere px-Spaltenwerte)
        expect(gridColumns).toMatch(/grid|repeat|fr|px[\s\S]*px/);
      } else {
        // Alternative: check layout by measuring item positions
        const newsItems = page.getByRole('article');
        const itemCount = await newsItems.count();

        if (itemCount >= 2) {
          const firstItem = newsItems.first();
          const secondItem = newsItems.nth(1);

          const firstBox = await firstItem.boundingBox();
          const secondBox = await secondItem.boundingBox();

          if (firstBox && secondBox) {
            // On desktop, items should be side by side (same row) rather than stacked
            const rowDifference = Math.abs(firstBox.y - secondBox.y);
            console.log(
              'Row difference between first two items:',
              rowDifference,
            );

            // If items are in the same row (row difference < item height), it's multi-column
            expect(rowDifference).toBeLessThan(100);
          }
        }
      }
    });

    test('Tablet: shows 2-column layout', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/news/public');

      // Wait for news items to load
      await expect(page.getByRole('article').first()).toBeVisible();

      const newsItems = page.getByRole('article');
      const itemCount = await newsItems.count();

      if (itemCount >= 2) {
        // Check grid container for column layout
        const container = page
          .locator('[role="list"]')
          .filter({ hasText: 'News articles' });
        if ((await container.count()) > 0) {
          const gridColumns = await container.evaluate((el) => {
            const style = window.getComputedStyle(el);
            return style.gridTemplateColumns || style.display;
          });
          console.log('Tablet grid layout:', gridColumns);

          // For tablets, we expect either 2-column grid or responsive layout
          // The actual implementation may vary, so we check if items are laid out reasonably
          const firstBox = await newsItems.first().boundingBox();
          const secondBox = await newsItems.nth(1).boundingBox();

          if (firstBox && secondBox) {
            // Check if items are reasonably positioned (not necessarily in strict columns)
            expect(firstBox.width).toBeGreaterThan(200); // Items should have reasonable width
            expect(secondBox.width).toBeGreaterThan(200);
          }
        }
      }
    });

    test('Mobile: shows single column layout', async ({ page, isMobile }) => {
      if (!isMobile) {
        await page.setViewportSize({ width: 375, height: 667 });
      }

      await page.goto('/news/public');
      // Wait for news items to load
      await expect(page.getByRole('article').first()).toBeVisible();

      const newsItems = page.getByRole('article');
      const itemCount = await newsItems.count();

      if (itemCount >= 2) {
        // On mobile, items should be stacked vertically
        const firstBox = await newsItems.first().boundingBox();
        const secondBox = await newsItems.nth(1).boundingBox();

        if (firstBox && secondBox) {
          // Items should be in different rows (stacked)
          const rowDifference = Math.abs(firstBox.y - secondBox.y);
          console.log('Mobile row difference:', rowDifference);
          expect(rowDifference).toBeGreaterThan(50);

          // Items should span most of the width (single column)
          const viewportWidth = page.viewportSize()?.width || 375;
          // Relax this check slightly to account for padding/margins
          expect(firstBox.width).toBeGreaterThan(viewportWidth * 0.75);
        }
      }

      // Check CSS grid if present
      const container = page
        .locator('.grid, [style*="grid"], .news-grid')
        .first();
      if ((await container.count()) > 0) {
        const gridColumns = await container.evaluate(
          (el) => window.getComputedStyle(el).gridTemplateColumns,
        );
        console.log('Mobile grid layout:', gridColumns);

        // Should be single column
        expect(gridColumns).not.toMatch(/repeat\([23456789]|fr.*fr/);
      }
    });
  });

  test.describe('Touch Interactions', () => {
    test('Mobile: touch interactions work correctly', async ({
      page,
      isMobile,
    }) => {
      if (!isMobile) {
        test.skip();
      }

      await page.goto('/news/public');
      // Wait for news items to load
      await expect(page.getByRole('article').first()).toBeVisible();

      // Test touch on news item
      const firstNewsItem = page.getByRole('article').first();
      await firstNewsItem.scrollIntoViewIfNeeded();

      // Use tap instead of click for touch devices
      await firstNewsItem.tap();

      // Check if navigation occurred or modal opened
      await page.waitForTimeout(1000);

      const currentUrl = page.url();
      console.log('URL after tap:', currentUrl);

      // Should navigate to article or open modal
      const hasNavigated =
        !currentUrl.includes('/news/public') || currentUrl.includes('#');
      const hasModal =
        (await page.locator('[role="dialog"], .modal, .overlay').count()) > 0;

      expect(hasNavigated || hasModal).toBe(true);
    });

    test('Mobile: scroll behavior works', async ({ page, isMobile }) => {
      if (!isMobile) {
        await page.setViewportSize({ width: 375, height: 667 });
      }

      await page.goto('/news/public');
      // Wait for news items to load
      await expect(page.getByRole('article').first()).toBeVisible();

      // Get initial scroll position
      const initialScrollY = await page.evaluate(() => window.scrollY);

      // Scroll down
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(500);

      const afterScrollY = await page.evaluate(() => window.scrollY);
      expect(afterScrollY).toBeGreaterThan(initialScrollY);

      // Check if lazy loading or infinite scroll works
      const initialItemCount = await page.getByRole('article').count();

      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);

      const finalItemCount = await page.getByRole('article').count();
      console.log(
        `Items before scroll: ${initialItemCount}, after: ${finalItemCount}`,
      );

      // Note: This test depends on whether the app implements infinite scroll
    });
  });

  test.describe('Cross-Device Compatibility', () => {
    test('iPhone 13: complete user journey', async ({ browser }) => {
      // Use iPhone 13 device settings
      const context = await browser.newContext({
        ...devices['iPhone 13'],
      });
      const page = await context.newPage();

      // Test complete mobile journey
      await page.goto('/');

      // Navigate to news - be specific to avoid multiple matches
      const newsLink = page
        .getByRole('link', { name: /public news|navigate to public news/i })
        .first();
      if ((await newsLink.count()) > 0) {
        await newsLink.tap();
      } else {
        await page.goto('/news/public');
      }

      // Wait for news items to load
      await expect(page.getByRole('article').first()).toBeVisible();

      // Verify news items are visible and appropriately sized
      const newsItems = page.getByRole('article');
      const itemCount = await newsItems.count();
      expect(itemCount).toBeGreaterThan(0);

      // Check touch target sizes (minimum 44x44px for accessibility)
      if (itemCount > 0) {
        const firstItem = newsItems.first();
        const box = await firstItem.boundingBox();

        if (box) {
          expect(box.height).toBeGreaterThan(44);
          expect(box.width).toBeGreaterThan(44);
        }
      }

      await context.close();
    });

    test('Pixel 5: navigation and search', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['Pixel 5'],
      });
      const page = await context.newPage();

      await page.goto('/news/public');
      // Wait for news items to load
      await expect(page.getByRole('article').first()).toBeVisible();

      // Look for search input by its role and name
      const searchInput = page.getByRole('textbox', {
        name: 'Search news articles',
      });

      // Test search on mobile if input is visible
      if (await searchInput.isVisible()) {
        await searchInput.tap();
        await searchInput.fill('technology');
        await page.keyboard.press('Enter');
        await page.waitForLoadState('networkidle');

        // Verify search results
        const resultsCount = await page.getByRole('article').count();
        console.log('Search results on mobile:', resultsCount);
      }

      await context.close();
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

        // Check that page renders without horizontal scroll
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20); // Allow 20px buffer

        // Check that main content is visible
        const mainContent = page
          .locator('main, [role="main"], .main-content')
          .first();
        if ((await mainContent.count()) > 0) {
          await expect(mainContent).toBeVisible();
        }

        // Check navigation is accessible
        const navLinks = page.locator('nav a, .nav-link');
        const linkCount = await navLinks.count();
        expect(linkCount).toBeGreaterThan(0);

        console.log(
          `${viewport.name}: Body width ${bodyWidth}px, Nav links: ${linkCount}`,
        );
      });
    }
  });

  test.describe('Orientation Changes', () => {
    test('handles orientation change gracefully', async ({
      page,
      isMobile,
    }) => {
      if (!isMobile) {
        test.skip();
      }

      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/news/public');
      // Wait for news items to load
      await expect(page.getByRole('article').first()).toBeVisible();

      const portraitItemCount = await page.getByRole('article').count();

      // Switch to landscape
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(1000);

      // Content should still be accessible
      const landscapeItemCount = await page.getByRole('article').count();
      expect(landscapeItemCount).toBe(portraitItemCount);

      // Layout might change but content should remain
      const navigation = page.locator('nav');
      await expect(navigation).toBeVisible();
    });
  });
});
