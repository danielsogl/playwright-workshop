import { test, expect } from '@playwright/test';
import { NewsPageAdvanced } from '../pages/NewsPageAdvanced';

test.describe('Exercise 10: Advanced Page Objects with Components', () => {
  let newsPage: NewsPageAdvanced;

  test.beforeEach(async ({ page }) => {
    newsPage = await new NewsPageAdvanced(page).goto();
  });

  test('Rückgabewerte - jeder Schritt mit await', async () => {
    const initialCount = await newsPage.getCount();

    // Suchbegriff und Kategorie aus den Daten: läuft mit Live- und Offline-Feeds
    const firstItem = newsPage.getFirstNewsItem();
    const title = await firstItem.getTitle();
    const category = await firstItem.getCategory();

    // Keine Kette wie search().filterByCategory(): jede Methode liefert ein Promise
    const searchResults = await newsPage.search(title);
    const filtered = await searchResults.filterByCategory(category);
    await expect(filtered.getFirstNewsItem().title).toHaveText(title);
    await expect(filtered.getFirstNewsItem().category).toHaveText(category);

    // Zurücksetzen
    await filtered.resetAllFilters();
    await expect(newsPage.newsItems).toHaveCount(initialCount);
  });

  test('Component Pattern - Arbeiten mit News Items', async () => {
    // Hole ersten News-Artikel als Component
    const firstItem = newsPage.getFirstNewsItem();

    // Assertions über die Locators der Component
    await expect(firstItem.root).toBeVisible();
    await expect(firstItem.title).not.toBeEmpty();

    await firstItem.hover();

    // Hole alle Artikel-Daten
    const articleData = await firstItem.getData();
    expect(articleData.title).toBeTruthy();
    expect(articleData.linkUrl).toMatch(/^(\/|http)/); // Relative or absolute URL
  });

  test('Arbeite mit mehreren News Items', async () => {
    const allItems = await newsPage.getAllNewsItems();

    // Mindestens ein Artikel sollte vorhanden sein
    expect(allItems.length).toBeGreaterThan(0);

    // Prüfe die ersten 3 Artikel
    for (const item of allItems.slice(0, 3)) {
      await expect(item.title).not.toBeEmpty();
      await expect(item.link).toHaveAttribute('target', '_blank');
    }
  });

  test('Komplexer User Flow: Suchen, Details, Zurücksetzen', async () => {
    const initialCount = await newsPage.getCount();

    // Schritt 1: Nach dem Titel des zweiten Artikels suchen
    const title = await newsPage.getNewsItem(1).getTitle();
    await newsPage.search(title);
    await expect(newsPage.newsItems).toContainText([title]);

    // Schritt 2: Mit dem ersten Treffer interagieren (ohne Klick, sonst neuer Tab)
    const firstResult = newsPage.getFirstNewsItem();
    await firstResult.hover();
    await expect(firstResult.link).toHaveAttribute('href', /^(\/|http)/);

    // Schritt 3: Suche zurücksetzen
    await newsPage.clearSearch();
    await expect(newsPage.newsItems).toHaveCount(initialCount);
  });

  test('Filter by Category mit Components', async () => {
    const category = await newsPage.getFirstNewsItem().getCategory();

    await newsPage.filterByCategory(category);

    // Jeder angezeigte Artikel gehört zur gewählten Kategorie
    const filteredItems = await newsPage.getAllNewsItems();
    expect(filteredItems.length).toBeGreaterThan(0);
    for (const item of filteredItems) {
      await expect(item.category).toHaveText(category);
    }
  });

  test('Extrahiere und validiere alle Artikel-Titel', async () => {
    // Nutze die getTitles Methode
    const titles = await newsPage.getTitles();

    // Sollten Titel vorhanden sein
    expect(titles.length).toBeGreaterThan(0);

    for (const title of titles.filter(Boolean)) {
      expect(title).not.toMatch(/undefined|null|\[object/i);
    }
  });

  test('Lade-Status prüfen', async ({ page }) => {
    // API verzögern, damit der Lade-Indikator sicher sichtbar ist
    await page.route('**/api/news/public', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Offline-Feed statt Live-RSS: der Test prüft den Ladezustand, nicht die Feed-Daten
      await route.fulfill({ path: 'app/api/feed.json' });
    });

    await page.reload();

    await expect(newsPage.loadingIndicator).toBeVisible();
    await expect(newsPage.newsItems.first()).toBeVisible();
    await expect(newsPage.loadingIndicator).toBeHidden();
  });
});
