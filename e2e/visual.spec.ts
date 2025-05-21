import test, { expect } from '@playwright/test';

test.describe('Visual Regression', { tag: ['@visual', '@regression'] }, () => {
  test('should have no visual regressions', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveScreenshot();
  });

  test('should validate text snapshot', async ({ page }) => {
    await page.goto('/');

    const title = await page.getByText('This application').textContent();

    expect(title).toMatchSnapshot('title.txt');
  });
});
