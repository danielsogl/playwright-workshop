import { test, expect } from '@playwright/test';

// Eigene Timeouts als benannte Konstante statt magischer Zahl
const SLOW_UI_TIMEOUT = 5_000;

test.describe('Übung 4 - Erste Tests mit Assertions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Navigation Links prüfen', async ({ page }) => {
    // Public News Link prüfen
    const publicNewsLink = page.getByRole('link', {
      name: /view public news/i,
    });
    await expect(publicNewsLink).toBeVisible();
    await expect(publicNewsLink).toHaveText('View Public News');

    // Link klicken und URL prüfen
    await publicNewsLink.click();
    await expect(page).toHaveURL(/.*public/);

    // Zurück zur Hauptseite
    await page.goBack();
    await expect(page).toHaveURL('http://localhost:3000/');
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

    // count() wartet nicht, daher erst auf den ersten Artikel warten
    await expect(articles.first()).toBeVisible();

    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
    console.log(`Gefundene Artikel: ${count}`);
  });

  test('Suchfeld Interaktion mit Assertions', async ({ page }) => {
    // Navigate to news page first for search box
    await page.goto('/news/public');
    await expect(page.getByRole('article').first()).toBeVisible();

    // Suchfeld finden und prüfen
    const searchBox = page.getByRole('textbox', {
      name: 'Search news articles',
    });
    await expect(searchBox).toBeVisible();
    await expect(searchBox).toBeEditable();
    await expect(searchBox).toBeEmpty();

    // Text eingeben
    await searchBox.fill('Playwright');
    await expect(searchBox).toHaveValue('Playwright');

    // Enter drücken (die Suche filtert bereits beim Tippen)
    await searchBox.press('Enter');

    // Prüfen ob Ergebnisse gefiltert wurden
    const articles = page.getByRole('article');
    const afterSearchCount = await articles.count();
    console.log(`Artikel nach Suche: ${afterSearchCount}`);

    // Trefferzähler passt zur Artikelliste (Web-First statt waitForTimeout)
    await expect(
      page.getByText(`${afterSearchCount} articles found`, { exact: true }),
    ).toBeVisible();

    // Suchfeld leeren
    await searchBox.clear();
    await expect(searchBox).toBeEmpty();
  });

  test('Theme Toggle mit Assertions', async ({ page }) => {
    // Theme Toggle ist ein Switch; es gibt ihn für Desktop und Mobile,
    // visible() nimmt nur den sichtbaren
    const themeToggle = page
      .getByRole('switch', { name: /switch to (dark|light) mode/i })
      .visible();
    await expect(themeToggle).toBeVisible();

    // Initial State merken (next-themes setzt "light" oder "dark" als Klasse auf <html>)
    const htmlElement = page.locator('html');
    const initialClass = (await htmlElement.getAttribute('class')) ?? '';
    console.log('Initial theme class:', initialClass);

    // Theme umschalten
    await themeToggle.click();

    // Web-First Assertion statt waitForTimeout: wartet bis sich die Klasse ändert
    await expect(htmlElement).not.toHaveClass(initialClass);

    // Zurückschalten
    await themeToggle.click();
    await expect(htmlElement).toHaveClass(initialClass);
  });

  test('Element Sichtbarkeit und State prüfen', async ({ page }) => {
    // Verschiedene Assertion-Methoden üben

    // 1. toBeVisible() - Element ist sichtbar
    const navigation = page.getByRole('navigation').first();
    await expect(navigation).toBeVisible();

    // 2. toBeHidden() - auf dem Desktop ist der Button fürs mobile Menü versteckt
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();

    // 3. toHaveAttribute() - Attribute prüfen: der Logo-Link führt zur Startseite
    await expect(
      page.getByRole('link', { name: 'Go to homepage' }),
    ).toHaveAttribute('href', '/');

    // Navigate to news page for search box
    await page.goto('/news/public');
    await expect(page.getByRole('article').first()).toBeVisible();

    // 4. toBeEnabled() / toBeDisabled()
    const searchBox = page.getByRole('textbox', {
      name: 'Search news articles',
    });
    await expect(searchBox).toBeEnabled();

    // 5. toContainText() - Teiltext prüfen
    const firstArticle = page.getByRole('article').first();
    await expect(firstArticle).toContainText(/[a-zA-Z]/); // Enthält Text

    // 6. toHaveCount() - Anzahl prüfen: der Trefferzähler passt zur Liste
    const articleCount = await page.getByRole('article').count();
    await expect(
      page.getByText(`${articleCount} articles found`, { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('article')).toHaveCount(articleCount);
  });

  test('Wait-Strategien mit Assertions', async ({ page }) => {
    // Navigate to news page first
    await page.goto('/news/public');
    await expect(page.getByRole('article').first()).toBeVisible();

    // waitFor mit verschiedenen States
    const searchBox = page.getByRole('textbox', {
      name: 'Search news articles',
    });

    // Warten bis Element sichtbar ist
    await searchBox.waitFor({ state: 'visible' });
    await expect(searchBox).toBeVisible();

    // Text eingeben und auf Reaktion warten
    await searchBox.fill('Test');

    // Warten mit eigenem Timeout (benannte Konstante, siehe Dateianfang)
    await expect(searchBox).toHaveValue('Test', { timeout: SLOW_UI_TIMEOUT });

    // Auf Text in der Seite warten
    await expect(page.getByText('News Feed')).toBeVisible();

    // Negativ-Assertion: das mobile Menü ist auf dem Desktop nicht sichtbar
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
  });

  test('Assertion Chains und Kombinationen', async ({ page }) => {
    // Navigate to news page first
    await page.goto('/news/public');
    await expect(page.getByRole('article').first()).toBeVisible();

    // Mehrere Assertions nacheinander
    const searchBox = page.getByRole('textbox', {
      name: 'Search news articles',
    });

    // Assertion Chain
    await expect(searchBox).toBeVisible();
    await expect(searchBox).toBeEnabled();
    await expect(searchBox).toBeEditable();
    await searchBox.focus();
    await expect(searchBox).toBeFocused();

    // Soft Assertions (Fehler sammeln, nicht sofort abbrechen)
    await expect.soft(searchBox).toBeVisible();
    await expect.soft(searchBox).toHaveAttribute('type', 'text');

    // Custom Error Messages
    await expect(searchBox, 'Suchfeld sollte sichtbar sein').toBeVisible();

    // Regex und Pattern Matching
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toHaveText(/News|Feed/);
    await expect(heading).not.toHaveText(/Error/);
  });
});
