import { test, expect } from '@playwright/test';

test('App ist erreichbar', async ({ page }) => {
  await page.goto('/');

  // Prüfe ob die App lädt
  await expect(page).toHaveTitle(/Playwright Demo/);

  // Prüfe ob die Hauptnavigation vorhanden ist
  await expect(page.getByRole('navigation').first()).toBeVisible();
});
