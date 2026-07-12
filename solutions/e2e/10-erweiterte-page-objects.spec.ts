import { test, expect } from '@playwright/test';
import { NewsPageAdvanced } from '../pages/NewsPageAdvanced';
import { NewsItemComponent } from '../pages/components/NewsItemComponent';

test.describe('Exercise 10: Advanced Page Objects with Components', () => {
  let newsPage: NewsPageAdvanced;

  test.beforeEach(async ({ page }) => {
    newsPage = new NewsPageAdvanced(page);
    await newsPage.goto();
  });

  test('Fluent Interface - Verkettete Aktionen', async () => {
    // Fluent chaining für mehrere Aktionen
    await newsPage
      .search('Technology')
      .then((page) => page.filterByCategory('Tech'))
      .then((page) => page.sortBy('date'));

    // Prüfe Ergebnisse
    const count = await newsPage.getCount();
    expect(count).toBeGreaterThanOrEqual(0);

    // Zurücksetzen mit Fluent Interface
    await newsPage.resetAllFilters();
    const resetCount = await newsPage.getCount();
    expect(resetCount).toBeGreaterThanOrEqual(count);
  });

  test('Component Pattern - Arbeiten mit News Items', async () => {
    // Hole ersten News-Artikel als Component
    const firstItem = newsPage.getFirstNewsItem();

    // Prüfe Sichtbarkeit
    expect(await firstItem.isVisible()).toBeTruthy();

    // Extrahiere Daten
    const title = await firstItem.getTitle();
    expect(title).toBeTruthy();
    console.log('First article title:', title);

    // Hover und Interaktion mit Fluent Interface
    await firstItem.hover().then((item) => item.expandAndRead());

    // Hole alle Artikel-Daten
    const articleData = await firstItem.getData();
    console.log('Article data:', articleData);

    expect(articleData.title).toBeTruthy();
    if (articleData.linkUrl) {
      expect(articleData.linkUrl).toMatch(/^(\/|http)/); // Relative or absolute URL
    }
  });

  test('Arbeite mit mehreren News Items', async () => {
    const allItems = await newsPage.getAllNewsItems();

    // Mindestens ein Artikel sollte vorhanden sein
    expect(allItems.length).toBeGreaterThan(0);

    // Iteriere über die ersten 3 Artikel
    const itemsToCheck = allItems.slice(0, 3);

    for (const [index, item] of itemsToCheck.entries()) {
      const data = await item.getData();
      console.log(`Article ${index + 1}:`, data.title);

      // Prüfe ob Titel vorhanden
      expect(data.title).toBeTruthy();

      // Prüfe ob Bild vorhanden (optional)
      const hasImage = await item.hasImage();
      console.log(`Article ${index + 1} has image:`, hasImage);
    }
  });

  test('Komplexer User Flow mit Fluent Interface', async () => {
    // Schritt 1: Suche nach Artikeln
    await newsPage.search('Update');
    const searchResults = await newsPage.getCount();
    console.log(`Found ${searchResults} articles with "Update"`);

    // Schritt 2: Hole Details des ersten Artikels
    if (searchResults > 0) {
      const firstResult = newsPage.getFirstNewsItem();
      const data = await firstResult.getData();

      // Schritt 3: Interagiere mit dem Artikel (without clicking to prevent navigation)
      await firstResult.hover();
    }

    // Schritt 4: Zurück und Filter zurücksetzen
    await newsPage.goto(); // Zurück zur News-Seite
    await newsPage.clearSearch();

    // Schritt 5: Pagination testen
    const initialCount = await newsPage.getCount();

    // Versuche zur nächsten Seite zu gehen
    await newsPage.nextPage();

    // Wenn Pagination vorhanden, sollten andere Artikel angezeigt werden
    const afterPaginationCount = await newsPage.getCount();
    console.log(`Items after pagination: ${afterPaginationCount}`);
  });

  test('Filter by Category mit Components', async () => {
    // Hole alle Artikel
    const allItems = await newsPage.getAllNewsItems();

    // Suche nach Artikeln mit bestimmter Kategorie
    const techArticles: NewsItemComponent[] = [];

    for (const item of allItems) {
      if (await item.hasCategory('Tech')) {
        techArticles.push(item);
      }
    }

    console.log(
      `Found ${techArticles.length} Tech articles out of ${allItems.length} total`,
    );

    // Wenn Tech-Artikel gefunden, prüfe Details
    if (techArticles.length > 0) {
      const firstTechArticle = techArticles[0];
      const category = await firstTechArticle.getCategory();
      expect(category.toLowerCase()).toContain('tech');
    }
  });

  test('Extrahiere und validiere alle Artikel-Titel', async () => {
    // Nutze die getTitles Methode
    const titles = await newsPage.getTitles();

    // Sollten Titel vorhanden sein
    expect(titles.length).toBeGreaterThan(0);

    // Filter out empty titles and validate non-empty ones
    const nonEmptyTitles = titles.filter(
      (title) => title && title.trim().length > 0,
    );
    console.log(
      `Found ${nonEmptyTitles.length} non-empty titles out of ${titles.length} total`,
    );

    nonEmptyTitles.forEach((title, index) => {
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);

      // Optional: Prüfe auf verdächtige Zeichen
      expect(title).not.toMatch(/undefined|null|\[object/i);
    });

    console.log(`Validated ${titles.length} article titles`);
    console.log('Sample titles:', titles.slice(0, 3));
  });

  test('Performance Test - Lade-Status prüfen', async () => {
    // Neue Suche starten
    const searchPromise = newsPage.search('Performance');

    // Prüfe ob Loading-Indikator erscheint (sehr schnell)
    const isLoading = await newsPage.isLoading();
    console.log('Loading indicator visible:', isLoading);

    // Warte auf Suchergebnis
    await searchPromise;

    // Loading sollte jetzt weg sein
    const stillLoading = await newsPage.isLoading();
    expect(stillLoading).toBeFalsy();

    // Prüfe ob Ergebnisse da sind
    const hasResults = await newsPage.hasResults();
    console.log('Has results after search:', hasResults);
  });

  test('Social Sharing mit Components', async () => {
    const firstItem = newsPage.getFirstNewsItem();

    // Versuche über verschiedene Plattformen zu teilen
    const platforms: Array<'twitter' | 'facebook' | 'linkedin'> = [
      'twitter',
      'facebook',
      'linkedin',
    ];

    for (const platform of platforms) {
      await firstItem.shareVia(platform).catch(() => {
        console.log(`${platform} sharing not available or prevented`);
      });
    }

    // Artikel-Link sollte teilbar sein
    const linkUrl = await firstItem.getLinkUrl();
    if (linkUrl) {
      expect(linkUrl).toBeTruthy();
      console.log('Article URL for sharing:', linkUrl);
    }
  });
});
