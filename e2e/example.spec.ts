import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('button', { name: 'Search (Meta+k)' }).click();
  await page.getByRole('searchbox', { name: 'Search' }).fill('fixture');
  await page.getByRole('link', { name: 'Using a fixture Fixtures' }).click();
  await page.getByRole('link', { name: 'Execution order', exact: true }).click();
  await page.locator('body').press('ControlOrMeta+k');
  await page.getByRole('searchbox', { name: 'Search' }).fill('mock');
  await page.getByRole('searchbox', { name: 'Search' }).press('ArrowDown');
  await page.getByRole('searchbox', { name: 'Search' }).press('ArrowDown');
  await page.getByRole('searchbox', { name: 'Search' }).press('ArrowDown');
  await page.getByRole('searchbox', { name: 'Search' }).press('Enter');
});
