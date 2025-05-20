import test, { expect } from '@playwright/test';

test.describe('Private News', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/news/private');
  });

  test('should show private news title', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Your Private News Feeds' }),
    ).toBeVisible();
  });
});
