import test, { expect } from "@playwright/test";


test.describe("Locators", () => {
  test("navigate to login page", async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('main')
      .getByRole('link', { name: 'Sign in' }).click();
  });

  test("navigate to public news page", async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Navigate to Public News' }).click();
  });

  test('Überschriften und Texte prüfen', async ({ page }) => {
    // Zur News-Seite navigieren
    await page.goto('http://localhost:3000/news/public');

    // Hauptüberschrift prüfen
    const heading = page.getByRole('heading', { name: 'News Feed' });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('News Feed');

    // News-Artikel Anzahl prüfen
    const articles = page.getByRole('article');
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
    console.log(`Gefundene Artikel: ${count}`);

    // Erster Artikel sollte sichtbar sein
    await expect(articles.first()).toBeVisible();
  });
});
