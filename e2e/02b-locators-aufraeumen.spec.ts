import { test, expect } from '@playwright/test';

test('News suchen', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'View Public News' }).click();
  await expect(page.getByRole('heading', { name: 'News Feed' })).toBeVisible();
  await expect(page.getByRole('article').first()).toBeVisible();
  await page.getByLabel('Search news articles').fill('Playwright');
  await page.getByLabel('Filter news by category').selectOption('Technology');
  await expect(page.getByText(/\d+ articles? found/)).toBeVisible();
});
