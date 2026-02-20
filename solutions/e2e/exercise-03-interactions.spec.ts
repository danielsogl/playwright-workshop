import { test, expect } from '@playwright/test';

test.describe('Übung 3 - Erste Interaktionen (ohne Assertions)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Klick-Interaktionen üben', async ({ page }) => {
    // 1. Auf den "Public News" Link klicken
    const publicNewsLink = page.getByRole('link', { name: /public news/i });
    await publicNewsLink.click();
    console.log('Public News Link wurde geklickt');

    // Kurz warten um die Navigation zu sehen
    await page.waitForTimeout(1000);

    // 2. Theme Toggle Button klicken
    const themeToggle = page.getByRole('switch').first();
    await themeToggle.click();
    console.log('Theme Toggle wurde geklickt');

    // Visuell beobachten was passiert
    await page.waitForTimeout(1000);

    // Nochmal klicken um zurückzuschalten
    await themeToggle.click();
    console.log('Theme wurde zurückgeschaltet');
  });

  test('Tastatur-Eingaben üben', async ({ page }) => {
    // Navigiere zur News-Seite für Suche
    await page.goto('http://localhost:3000/news/public');
    await page.waitForLoadState('networkidle');

    // 1. Suchfeld finden und Text eingeben
    const searchBox = page.getByPlaceholder('Search news...');
    await searchBox.click();
    console.log('Suchfeld wurde angeklickt');

    // 2. Text eingeben
    await searchBox.fill('Playwright');
    console.log('Text "Playwright" wurde eingegeben');

    // 3. Enter drücken
    await page.keyboard.press('Enter');
    console.log('Enter wurde gedrückt');

    // Beobachten wie sich die Liste ändert
    await page.waitForTimeout(2000);

    // 4. Suchfeld leeren
    await searchBox.clear();
    console.log('Suchfeld wurde geleert');

    // 5. Anderen Suchbegriff eingeben
    await searchBox.type('Testing', { delay: 100 }); // Mit Verzögerung tippen
    console.log('Text "Testing" wurde langsam getippt');

    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
  });

  test('Formular-Interaktionen (optional)', async ({ page }) => {
    // Zum Login navigieren (falls vorhanden)
    const loginLink = page.getByRole('link', { name: /login/i });
    const loginExists = (await loginLink.count()) > 0;

    if (loginExists) {
      await loginLink.click();
      console.log('Login-Seite wurde geöffnet');

      // Username eingeben
      const usernameField = page
        .getByLabel(/username/i)
        .or(page.getByPlaceholder(/username/i));
      await usernameField.fill('testuser');
      console.log('Username wurde eingegeben');

      // Password eingeben
      const passwordField = page
        .getByLabel(/password/i)
        .or(page.getByPlaceholder(/password/i));
      await passwordField.fill('testpass123');
      console.log('Password wurde eingegeben');

      // Submit Button klicken
      const submitButton = page.getByRole('button', { name: /submit|login/i });
      await submitButton.click();
      console.log('Formular wurde abgeschickt');

      // Beobachten was passiert
      await page.waitForTimeout(2000);
    } else {
      console.log('Kein Login-Link gefunden - überspringe Formular-Test');
    }
  });

  test('Verschiedene Interaktionsmethoden', async ({ page }) => {
    // Navigiere zur News-Seite für Artikel
    await page.goto('http://localhost:3000/news/public');
    await page.waitForLoadState('networkidle');

    // Hover über Elemente
    const firstArticle = page.getByRole('article').first();
    await firstArticle.hover();
    console.log('Hover über ersten Artikel');
    await page.waitForTimeout(500);

    // Doppelklick (falls relevant)
    const heading = page.getByRole('heading', { level: 1 }).first();
    await heading.dblclick();
    console.log('Doppelklick auf Überschrift');

    // Rechtsklick
    await firstArticle.click({ button: 'right' });
    console.log('Rechtsklick auf Artikel');

    // Escape drücken um Kontextmenü zu schließen
    await page.keyboard.press('Escape');

    // Tab-Navigation
    await page.keyboard.press('Tab');
    console.log('Tab gedrückt - nächstes Element fokussiert');
    await page.keyboard.press('Tab');
    console.log('Tab gedrückt - nächstes Element fokussiert');

    // Shift+Tab zurück
    await page.keyboard.press('Shift+Tab');
    console.log('Shift+Tab - vorheriges Element fokussiert');
  });
});
