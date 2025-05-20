import test, { expect } from '@playwright/test';

test.describe('Locators', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  });

  test('Sollte Titel zeigen', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Playwright enables reliable' }),
    ).toBeVisible();
  });

  test('Sollte Docs Link zeigen', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
  });
});
