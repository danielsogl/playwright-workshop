import { test, expect } from '@playwright/test';

test.describe('Übung 3 - Erste Interaktionen (ohne Assertions)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Klick-Interaktionen üben', async ({ page }) => {
    // 1. Auf den "Public News" Link klicken
    const publicNewsLink = page.getByRole('link', {
      name: /view public news/i,
    });
    await publicNewsLink.click();
    console.log('Public News Link wurde geklickt');

    // Auf die Navigation warten statt fester Wartezeit
    await page.waitForURL('**/news/public');

    // 2. Theme Toggle Button klicken
    // Den Toggle gibt es für Desktop und Mobile, visible() nimmt nur den sichtbaren
    const themeToggle = page.getByRole('switch').visible();
    await themeToggle.click();
    console.log('Theme Toggle wurde geklickt');

    // Zum Beobachten mit --headed oder im UI-Mode ausführen, feste Wartezeiten sind nicht nötig

    // Nochmal klicken um zurückzuschalten
    await themeToggle.click();
    console.log('Theme wurde zurückgeschaltet');
  });

  test('Tastatur-Eingaben üben', async ({ page }) => {
    // Navigiere zur News-Seite für Suche
    await page.goto('http://localhost:3000/news/public');

    // 1. Suchfeld finden und Text eingeben (click() wartet automatisch, bis das Feld da ist)
    const searchBox = page.getByPlaceholder('Search news');
    await searchBox.click();
    console.log('Suchfeld wurde angeklickt');

    // 2. Text eingeben
    await searchBox.fill('Playwright');
    console.log('Text "Playwright" wurde eingegeben');

    // 3. Enter drücken
    await searchBox.press('Enter');
    console.log('Enter wurde gedrückt');

    // Die Liste filtert direkt beim Tippen, kein Warten nötig

    // 4. Suchfeld leeren
    await searchBox.clear();
    console.log('Suchfeld wurde geleert');

    // 5. Anderen Suchbegriff Zeichen für Zeichen eingeben
    await searchBox.pressSequentially('Testing', { delay: 100 }); // Mit Verzögerung tippen
    console.log('Text "Testing" wurde langsam getippt');

    await searchBox.press('Enter');
  });

  test('Formular-Interaktionen (optional)', async ({ page }) => {
    // Zum Login navigieren
    await page.getByRole('link', { name: 'Sign in to your account' }).click();
    console.log('Login-Seite wurde geöffnet');

    // Email eingeben (Test-User aus der .env)
    await page
      .getByLabel('Email')
      .fill(process.env.TEST_USER_EMAIL ?? 'test@example.com');
    console.log('Email wurde eingegeben');

    // Password eingeben
    await page
      .getByLabel('Password')
      .fill(process.env.TEST_USER_PASSWORD ?? 'password');
    console.log('Password wurde eingegeben');

    // Submit Button klicken
    await page.getByRole('button', { name: 'Submit sign in form' }).click();
    console.log('Formular wurde abgeschickt');

    // Nach erfolgreichem Login leitet die App zur Startseite weiter
    await page.waitForURL('/');
  });

  test('Verschiedene Interaktionsmethoden', async ({ page }) => {
    // Navigiere zur News-Seite für Artikel
    await page.goto('http://localhost:3000/news/public');

    // Hover über Elemente (hover() wartet automatisch auf den Artikel)
    const firstArticle = page.getByRole('article').first();
    await firstArticle.hover();
    console.log('Hover über ersten Artikel');

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
