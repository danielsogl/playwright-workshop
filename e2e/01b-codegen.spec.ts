import { test, expect } from '@playwright/test';

// Mit `npx playwright codegen http://localhost:3000` aufgenommen.
// Danach von Hand: Testname vergeben, absolute URL durch '/' ersetzt,
// feste Trefferzahl durch RegExp.
test('News suchen und filtern', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'View Public News' }).click();
  await expect(page.getByRole('heading', { name: 'News Feed' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search news articles' }).click();
  await page
    .getByRole('textbox', { name: 'Search news articles' })
    .fill('Playwright');
  await expect(
    page.getByRole('textbox', { name: 'Search news articles' }),
  ).toHaveValue('Playwright');
  await page.getByLabel('Filter news by category').selectOption('Technology');
  await expect(page.getByText(/\d+ articles? found/)).toBeVisible();
});
