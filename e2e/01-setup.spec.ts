import { test, expect } from '@playwright/test';

test.describe('Exercise 1: Project Setup', () => {
  test('App ist erreichbar', async ({ page }) => {
    await page.goto('/');

    // Prüfe ob die App lädt
    await expect(page).toHaveTitle(/Playwright Demo/);

    // Prüfe ob Hauptnavigation vorhanden ist
    await expect(page.getByRole('navigation').first()).toBeVisible();

    // Zusätzliche Prüfung: Header-Logo vorhanden
    const logo = page.getByRole('link', { name: /logo|home/i }).first();
    await expect(logo).toBeVisible();
  });

  test('Wichtige Seiten sind erreichbar', async ({ page }) => {
    // Alle Seiten haben denselben Titel
    for (const url of ['/', '/news/public', '/auth/signin']) {
      await page.goto(url);
      await expect(page).toHaveTitle(/Playwright Demo/);
      await expect(page).toHaveURL(url);
    }
  });

  test('Umgebungsvariablen sind geladen', async () => {
    // playwright.config.ts lädt die .env per dotenv
    expect(process.env.TEST_USER_EMAIL).toBeDefined();
    expect(process.env.TEST_USER_PASSWORD).toBeDefined();
  });
});
