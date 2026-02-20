import { test, expect } from '@playwright/test';

test.describe('Exercise 0: Project Setup', () => {
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
    const pages = [
      { url: '/', title: /Playwright Demo/ },
      { url: '/about', title: /Playwright Demo/ }, // All pages have the same title
      { url: '/blog', title: /Playwright Demo/ },
      { url: '/news/public', title: /Playwright Demo/ },
      { url: '/pricing', title: /Playwright Demo/ },
    ];

    for (const { url, title } of pages) {
      await page.goto(url);
      await expect(page).toHaveTitle(title);
      await expect(page).toHaveURL(new RegExp(url.replace(/\//g, '\\/')));
    }
  });

  test.skip('Umgebungsvariablen sind geladen', async () => {
    // Skip this test as environment variables are not set in this demo
    // In a real scenario, these would be configured in .env file
    expect(process.env.TEST_USER_EMAIL).toBeDefined();
    expect(process.env.TEST_USER_PASSWORD).toBeDefined();

    // Optional: Prüfe die Werte (nur für Demo-Zwecke)
    console.log(
      'Test-User Email configured:',
      process.env.TEST_USER_EMAIL ? 'Yes' : 'No',
    );
  });
});
