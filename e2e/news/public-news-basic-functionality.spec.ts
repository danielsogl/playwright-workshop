// spec: specs/public-news.plan.md
// seed: e2e/login.setup.ts

import { test, expect } from '@playwright/test';

test.describe('Public News – Page Load & Structure, Search & Category Filter', () => {
  test('should display page structure, search functionality, and category filter', async ({ page }) => {
    // 1.1 should display the page heading and subtitle
    await page.goto('http://localhost:3000/news/public');

    // Wait for news feed to finish loading
    await page.getByText("Loading news feed…").first().waitFor({ state: 'hidden' });

    // Verify page title
    await expect(page).toHaveTitle('Playwright Demo App');

    // Verify page heading and subtitle
    await expect(page.getByRole('heading', { level: 1, name: 'News Feed' })).toBeVisible();
    await expect(page.getByText('Browse the latest news from public RSS feeds')).toBeVisible();

    // 1.2 should show the articles count after loading
    await expect(page.getByText('77 articles found')).toBeVisible();

    // 1.3 should render article cards with all required fields
    await expect(page.getByRole('list', { name: 'News articles' })).toBeVisible();
    await expect(page.getByText('Reuters Financial News').first()).toBeVisible();
    await expect(page.getByText('Business').first()).toBeVisible();
    await expect(page.getByText('25. Februar 2026').first()).toBeVisible();

    // 1.4 should display the search input with correct placeholder
    await expect(page.getByRole('textbox', { name: 'Search news articles' })).toBeVisible();

    // 2.1 Search for 'technology' term
    await page.getByRole('textbox', { name: 'Search news articles' }).fill('technology');
    await new Promise(f => setTimeout(f, 1 * 1000));
    await expect(page.getByText('3 articles found')).toBeVisible();

    // 2.2 Search for non-existent term
    await page.getByRole('textbox', { name: 'Search news articles' }).fill('xyz123nonexistentnewsterm');
    await new Promise(f => setTimeout(f, 1 * 1000));
    await expect(page.getByText('0 articles found')).toBeVisible();

    // 2.3 Clear search field to show all articles
    await page.getByRole('textbox', { name: 'Search news articles' }).fill('');
    await new Promise(f => setTimeout(f, 1 * 1000));
    await expect(page.getByText('77 articles found')).toBeVisible();

    // 3.1 Filter articles by Technology category
    await page.getByLabel('Filter news by category').selectOption(['Technology']);
    await expect(page.getByText('20 articles found')).toBeVisible();
  });
});