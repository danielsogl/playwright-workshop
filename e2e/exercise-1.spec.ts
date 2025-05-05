import { test, expect } from '@playwright/test';

test('Navigiere zur Public News Seite', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Playwright Demo App')).toBeVisible();

  await page.getByRole('menuitem', { name: 'Navigate to Public News' }).click();

  await expect(page).toHaveURL('/news/public');

  await expect(page.getByRole('heading', { name: 'News Feed' })).toBeVisible();
});
