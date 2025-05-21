import test, { devices, expect } from '@playwright/test';

test.describe('Mobile Tests', { tag: ['@mobile'] }, () => {
  test('should not show permissions dialog', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 15'],
      permissions: ['geolocation'],
    });

    const page = await context.newPage();

    await page.goto('https://www.lieferando.de/en');

    await expect(page).toHaveTitle(
      'Lieferando.de | Food Delivery, Groceries & More Near You',
    );
  });

  test('should navigate to docs page on mobile', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 15'],
      colorScheme: 'dark',
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    await page.getByRole('button', { name: 'Toggle navigation bar' }).click();
    await page.getByRole('link', { name: 'Docs' }).click();

    await expect(page).toHaveURL('https://playwright.dev/docs/intro');

    page.setViewportSize({ height: 1080, width: 1920 });
    await page.getByRole('link', { name: 'API' }).click();
  });
});
