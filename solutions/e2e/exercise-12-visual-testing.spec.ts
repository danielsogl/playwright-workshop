/**
 * Exercise 7 - Visual Regression Testing Solution
 *
 * This test suite demonstrates visual regression testing with Playwright's screenshot capabilities.
 * Tests visual consistency across different states, themes, and viewports.
 *
 * Key learning points:
 * - Capture and compare screenshots for visual regression testing
 * - Handle dynamic content with masking
 * - Test across different themes and responsive breakpoints
 * - Configure screenshot options for consistent results
 */

import { test, expect } from '@playwright/test';

test.describe('Exercise 7: Visual Regression Testing', () => {
  // Global test configuration for consistent screenshots
  test.beforeEach(async ({ page }) => {
    // Disable animations for consistent screenshots
    await page.addInitScript(() => {
      // Disable CSS animations and transitions
      const style = document.createElement('style');
      style.innerHTML = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `;
      document.head.appendChild(style);
    });
  });

  test.describe('Homepage Visual Tests', () => {
    test('Homepage full page screenshot', async ({ page }) => {
      await page.goto('/');

      // Wait for content to load completely
      await page.waitForLoadState('networkidle');

      // Wait a bit more for any remaining content
      await page.waitForTimeout(1000);

      // Take full-page screenshot
      await expect(page).toHaveScreenshot('homepage-full.png', {
        fullPage: true,
        animations: 'disabled',
        // Threshold for pixel differences (0-1, where 1 means identical)
        threshold: 0.3,
      });
    });

    test('Homepage hero section', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Screenshot of just the hero/header section
      const heroSelectors = [
        'header',
        '.hero',
        '[data-testid="hero"]',
        'main > section:first-child',
        '.header-section',
      ];

      let heroElement = null;
      for (const selector of heroSelectors) {
        const element = page.locator(selector);
        if ((await element.count()) > 0) {
          heroElement = element.first();
          break;
        }
      }

      if (heroElement) {
        await expect(heroElement).toHaveScreenshot('homepage-hero.png', {
          animations: 'disabled',
        });
      } else {
        // Fallback: screenshot of the top portion of the page
        await expect(page).toHaveScreenshot('homepage-header-fallback.png', {
          clip: { x: 0, y: 0, width: 1280, height: 400 },
          animations: 'disabled',
        });
      }
    });

    test('Navigation bar visual consistency', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const navigation = page.locator('nav').first();
      await expect(navigation).toHaveScreenshot('navigation-bar.png', {
        animations: 'disabled',
      });
    });
  });

  test.describe('News Feed Visual Tests', () => {
    test('News feed layout screenshot', async ({ page }) => {
      await page.goto('/news/public');

      // Wait for news items to load
      await expect(page.getByRole('article').first()).toBeVisible();
      await page.waitForLoadState('networkidle');

      // Take screenshot of the news grid/list
      const newsContainer = page
        .locator('.grid, .news-grid, [data-testid="news-grid"]')
        .first();

      if ((await newsContainer.count()) > 0) {
        await expect(newsContainer).toHaveScreenshot('news-grid.png', {
          animations: 'disabled',
        });
      } else {
        // Fallback to main content area
        const mainContent = page.locator('main, [role="main"]').first();
        await expect(mainContent).toHaveScreenshot('news-content.png', {
          animations: 'disabled',
        });
      }
    });

    test('Individual news card with masked dynamic content', async ({
      page,
    }) => {
      await page.goto('/news/public');
      await expect(page.getByRole('article').first()).toBeVisible();

      const firstNewsCard = page.getByRole('article').first();

      // Mask dynamic content like timestamps
      const maskSelectors = [
        'time',
        '.timestamp',
        '[data-testid="publish-date"]',
        '.date',
        '.relative-time',
      ];

      const maskedElements = [];
      for (const selector of maskSelectors) {
        const elements = page.locator(selector);
        const count = await elements.count();
        for (let i = 0; i < count; i++) {
          maskedElements.push(elements.nth(i));
        }
      }

      await expect(firstNewsCard).toHaveScreenshot('news-card.png', {
        mask: maskedElements,
        maskColor: '#FF00FF', // Magenta mask color
        animations: 'disabled',
      });
    });

    test('Empty state visual test', async ({ page }) => {
      // Mock empty response
      await page.route('**/api/news/public', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ items: [] }),
        });
      });

      await page.goto('/news/public');
      await page.waitForLoadState('networkidle');

      // Wait for empty state to render
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('news-empty-state.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('Error state visual test', async ({ page }) => {
      // Mock error response
      await page.route('**/api/news/public', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      await page.goto('/news/public');
      await page.waitForLoadState('networkidle');

      // Wait for error state to render
      await page.waitForTimeout(2000);

      await expect(page).toHaveScreenshot('news-error-state.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });

  test.describe('Theme Visual Tests', () => {
    test('Light mode visual consistency', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Ensure light mode is active
      const themeToggleSelectors = [
        '[data-testid="theme-toggle"]',
        'button[aria-label*="theme" i]',
        '.theme-toggle',
        'button:has-text("🌙")',
        'button:has-text("🌞")',
      ];

      let themeToggle = null;
      for (const selector of themeToggleSelectors) {
        const element = page.locator(selector);
        if ((await element.count()) > 0) {
          themeToggle = element.first();
          break;
        }
      }

      // Check if we're in dark mode and switch to light if needed
      const isDarkMode =
        (await page
          .locator(
            'html[class*="dark"], body[class*="dark"], [data-theme="dark"]',
          )
          .count()) > 0;

      if (isDarkMode && themeToggle) {
        await themeToggle.click();
        await page.waitForTimeout(500);
      }

      await expect(page).toHaveScreenshot('light-mode.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('Dark mode visual consistency', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Find theme toggle switch
      const themeToggle = page.getByRole('switch', {
        name: /switch to (light|dark) mode/i,
      });

      // Toggle to dark mode
      await expect(themeToggle).toBeVisible();
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Take screenshot in dark mode
      await expect(page).toHaveScreenshot('dark-mode.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('Theme toggle button states', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const themeToggle = page
        .locator('[data-testid="theme-toggle"]')
        .or(page.locator('button[aria-label*="theme" i]'))
        .or(page.locator('.theme-toggle'))
        .first();

      if ((await themeToggle.count()) > 0) {
        // Screenshot before toggle
        await expect(themeToggle).toHaveScreenshot('theme-toggle-before.png');

        // Click toggle
        await themeToggle.click();
        await page.waitForTimeout(300);

        // Screenshot after toggle
        await expect(themeToggle).toHaveScreenshot('theme-toggle-after.png');
      }
    });
  });

  test.describe('Responsive Visual Tests', () => {
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop-xl' },
      { width: 1280, height: 720, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' },
    ];

    for (const viewport of viewports) {
      test(`Homepage ${viewport.name} viewport`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
          fullPage: true,
          animations: 'disabled',
        });
      });

      test(`News page ${viewport.name} viewport`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto('/news/public');
        await expect(page.getByRole('article').first()).toBeVisible();
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveScreenshot(`news-page-${viewport.name}.png`, {
          fullPage: true,
          animations: 'disabled',
        });
      });
    }
  });

  test.describe('Cross-Browser Visual Tests', () => {
    test('Cross-browser consistency', async ({ page, browserName }) => {
      await page.goto('/news/public');
      await expect(page.getByRole('article').first()).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot(`news-page-${browserName}.png`, {
        fullPage: true,
        animations: 'disabled',
        // Browser-specific threshold as rendering might differ slightly
        threshold: browserName === 'webkit' ? 0.4 : 0.3,
      });
    });

    test('Navigation consistency across browsers', async ({
      page,
      browserName,
    }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const navigation = page.locator('nav').first();
      await expect(navigation).toHaveScreenshot(
        `navigation-${browserName}.png`,
        {
          animations: 'disabled',
          threshold: 0.3,
        },
      );
    });
  });

  test.describe('Interactive State Visual Tests', () => {
    test('Button hover states', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Find primary buttons
      const buttonSelectors = [
        'button[type="submit"]',
        '.btn-primary',
        '[data-testid="cta-button"]',
        'button:has-text("Sign in")',
        'button:has-text("Login")',
      ];

      let button = null;
      for (const selector of buttonSelectors) {
        const element = page.locator(selector);
        if ((await element.count()) > 0) {
          button = element.first();
          break;
        }
      }

      if (button) {
        // Screenshot before hover
        await expect(button).toHaveScreenshot('button-normal.png');

        // Hover and screenshot
        await button.hover();
        await page.waitForTimeout(200);
        await expect(button).toHaveScreenshot('button-hover.png');
      }
    });

    test('Form input focus states', async ({ page }) => {
      // Try to find a page with forms
      const formPages = ['/auth/signin', '/contact', '/'];

      for (const pagePath of formPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');

        const inputSelectors = [
          'input[type="email"]',
          'input[type="text"]',
          'input[type="password"]',
          'textarea',
        ];

        let input = null;
        for (const selector of inputSelectors) {
          const element = page.locator(selector);
          if ((await element.count()) > 0) {
            input = element.first();
            break;
          }
        }

        if (input) {
          // Screenshot before focus
          await expect(input).toHaveScreenshot('input-normal.png');

          // Focus and screenshot
          await input.focus();
          await page.waitForTimeout(200);
          await expect(input).toHaveScreenshot('input-focus.png');
          break;
        }
      }
    });
  });

  test.describe('Loading State Visual Tests', () => {
    test('Loading state visual appearance', async ({ page }) => {
      // Mock delayed response to capture loading state
      await page.route('**/api/news/public', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            items: [
              {
                title: 'Test News',
                description: 'Test description',
                link: 'https://example.com',
                pubDate: new Date().toISOString(),
              },
            ],
          }),
        });
      });

      // Start navigation without waiting
      const navigationPromise = page.goto('/news/public');

      // Try to capture loading state
      try {
        await expect(
          page
            .getByTestId('loading')
            .or(page.locator('.loading'))
            .or(page.locator('.spinner'))
            .first(),
        ).toBeVisible();
        await expect(page).toHaveScreenshot('loading-state.png', {
          animations: 'disabled',
        });
      } catch {
        console.log('Loading state not captured - might be too fast');
      }

      // Wait for navigation to complete
      await navigationPromise;
      await page.waitForLoadState('networkidle');
    });
  });

  test.describe('Component-Specific Visual Tests', () => {
    test('Search component visual states', async ({ page }) => {
      await page.goto('/news/public');
      await page.waitForLoadState('networkidle');

      const searchInput = page
        .locator('input[placeholder*="search" i]')
        .or(page.locator('[role="searchbox"]'))
        .first();

      if ((await searchInput.count()) > 0) {
        // Empty search state
        await expect(searchInput).toHaveScreenshot('search-empty.png');

        // With text
        await searchInput.fill('technology');
        await expect(searchInput).toHaveScreenshot('search-with-text.png');

        // After search (if results change)
        await page.keyboard.press('Enter');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        const searchContainer = searchInput
          .locator('..')
          .or(page.locator('.search-container'));
        await expect(searchContainer).toHaveScreenshot(
          'search-results-context.png',
        );
      }
    });
  });
});
