import test, { expect } from '@playwright/test';

test.describe('Übung 1 - Navigation mit Assertions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Navigiere auf die Public News Seite und prüfe URL', async ({
    page,
  }) => {
    // Element anhand des exakten Textes finden und klicken
    // await page.getByText('Public News', { exact: true }).click();

    await page
      .getByRole('menuitem', { name: 'Navigate to Public News' })
      .click();

    await expect(page).toHaveURL('/news/public');
  });

  test('Navigiere auf die Public News Seite und prüfe Titel', async ({
    page,
  }) => {
    await page
      .getByRole('menuitem', { name: 'Navigate to Public News' })
      .click();

    // Dieser Test wartet 20 Sekunden maximal, da das Backend 10 Sekunden lang läuft
    await expect(page.getByRole('heading', { name: 'News Feed' })).toBeVisible({
      timeout: 20000,
    });
  });
});
