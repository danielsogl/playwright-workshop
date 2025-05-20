import test, { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Prüfe AAA Konformität', async ({ page }) => {
    const result = await new AxeBuilder({ page }).analyze();

    expect.soft(result.violations).toEqual([]);
  });
});
