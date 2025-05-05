import { test, expect } from '@playwright/test';

/**
 * This test suite demonstrates how to use Playwright's accessibility-focused selectors
 * to test the application without relying on IDs or CSS selectors.
 */
test.describe('Accessibility-based testing examples', () => {
  test('Homepage structure matches the expected accessibility tree', async ({
    page,
  }) => {
    await page.goto('/');

    // Test the heading structure
    await expect(page.locator('role=main')).toMatchAriaSnapshot(`
      - main:
        - heading "Welcome to the" [level=1]
        - heading "Playwright Demo App" [level=1]
        - paragraph
        - link "View Public News"
        - link "View Private News"
        - link "Sign In"
        - heading "Key Features" [level=2]
        - list:
          - listitem
          - listitem
          - listitem
    `);

    // Test navigation links using role and accessible name
    await expect(
      page.getByRole('link', { name: 'View Public News' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'View Private News' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();

    // Test feature cards content
    await expect(
      page.getByRole('heading', { name: 'Authentication Testing' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'API Integration' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Dynamic Content' }),
    ).toBeVisible();
  });

  test('Sign in form has correct accessibility structure', async ({ page }) => {
    await page.goto('/auth/signin');

    // Test form structure using aria roles
    await expect(page.getByRole('form', { name: 'Sign in form' }))
      .toMatchAriaSnapshot(`
      - form "Sign in form":
        - heading "Sign In" [level=1]
        - textbox "Email address for sign in"
        - textbox "Password for sign in" [protected]
        - button "Sign In"
        - link "Sign Up"
    `);

    // Test form interaction using accessible labels
    await page.getByLabel('Email address for sign in').fill('test@example.com');
    await page.getByLabel('Password for sign in').fill('password123');

    // Submit form using accessible name
    await page.getByRole('button', { name: /submit sign in form/i }).click();
  });

  test('Public news page displays articles correctly', async ({ page }) => {
    await page.goto('/news/public');

    // Test loading state using role
    await expect(
      page.getByRole('status', { name: 'Loading news feed' }),
    ).toBeVisible();

    // Wait for content to load
    await expect(page.getByRole('list', { name: 'News articles' })).toBeVisible(
      { timeout: 10000 },
    );

    // Test search functionality with accessible labels
    await page.getByLabel('Search news articles').fill('technology');

    // Test category filter
    await page.getByLabel('Filter news by category').selectOption('Technology');

    // Find articles by their role and a partial name match
    const newsArticles = page.getByRole('article', { name: /News article:/ });

    // Check if any articles are visible
    await expect(newsArticles).toBeVisible();

    if ((await newsArticles.count()) > 0) {
      // Get the first article
      const firstArticle = newsArticles.first();

      // Test article content structure
      await expect(firstArticle).toMatchAriaSnapshot(`
        - article:
          - doc-subtitle
          - doc-subtitle
          - heading
          - link
          - doc-description
          - doc-publication-date
      `);

      // Test specific parts of the article using ARIA roles and labels
      await expect(firstArticle.getByRole('heading').first()).toBeVisible();

      await expect(firstArticle.getByRole('link')).toBeVisible();

      // Test using aria-labels
      await expect(
        firstArticle.locator('[aria-label^="Source:"]'),
      ).toBeVisible();

      await expect(
        firstArticle.locator('[aria-label^="Category:"]'),
      ).toBeVisible();

      await expect(
        firstArticle.locator('[aria-label^="Description:"]'),
      ).toBeVisible();

      await expect(
        firstArticle.locator('[aria-label^="Published:"]'),
      ).toBeVisible();
    }
  });

  test('Feed management for authenticated users', async ({ page }) => {
    // Mock authentication or sign in first
    await page.goto('/auth/signin');
    await page.getByLabel('Email address for sign in').fill('test@example.com');
    await page.getByLabel('Password for sign in').fill('password123');
    await page.getByRole('button', { name: /submit sign in form/i }).click();

    // Navigate to private feeds
    await page.goto('/news/private');

    // Test feed form
    await page.getByRole('form', { name: 'Add new RSS feed' }).isVisible();

    // Add new feed using labels
    await page.getByLabel('Name for the new feed').fill('Tech News');
    await page
      .getByLabel('URL for the new feed')
      .fill('https://example.com/feed.xml');
    await page.getByLabel('Optional category for the new feed').fill('Tech');

    // Submit the form
    await page.getByRole('button', { name: /add new feed/i }).click();

    // Check empty feed list using aria-label
    const emptyState = page.getByText(
      'No feeds added yet. Add your first feed above!',
    );
    if (await emptyState.isVisible()) {
      expect(await emptyState.textContent()).toContain('No feeds added yet');
    }

    // Test feed selection if feeds exist
    const feedItems = page
      .getByRole('listitem')
      .filter({ has: page.getByRole('button', { name: /select feed:/i }) });

    if ((await feedItems.count()) > 0) {
      await feedItems
        .first()
        .getByRole('button', { name: /select feed:/i })
        .click();

      // Check feed content loading by aria-label
      await expect(
        page.locator('[aria-label="Loading feed content"]'),
      ).toBeVisible();

      // Check if any articles load
      try {
        // Wait for articles to appear
        const articles = await page.getByRole('article', {
          name: /Feed article:/,
        });
        if ((await articles.count()) > 0) {
          // Test first article
          const firstArticle = articles.first();
          await expect(firstArticle).toBeVisible();

          // Test components of the article using aria-labels
          await expect(firstArticle.getByRole('link')).toBeVisible();
          await expect(
            firstArticle.locator('[aria-label^="Published:"]'),
          ).toBeVisible();
        } else {
          // Check for empty feed message
          await expect(
            page.locator('[aria-label="No feed items found"]'),
          ).toBeVisible();
        }
      } catch {
        // Handle error state - error message should be visible
        await expect(page.getByRole('alert')).toBeVisible();
      }
    }
  });
});
