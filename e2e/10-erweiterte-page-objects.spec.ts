import { test, expect } from '@playwright/test';
import { NewsPageAdvanced } from './pages/NewsPageAdvanced';

test.describe('Exercise 10: Advanced Page Objects with Components', () => {
  let newsPage: NewsPageAdvanced;

  test.beforeEach(async ({ page }) => {
    newsPage = await new NewsPageAdvanced(page).goto();
  });

  test('Suchtest aus Übung 9 mit NewsPageAdvanced', async () => {
    // Derselbe Ablauf wie in Übung 9: die Kopie hat dieselbe API
    await newsPage.waitForNewsItems();

    const initialCount = await newsPage.getNewsCount();
    expect(initialCount).toBeGreaterThan(0);
    const firstTitle = (await newsPage.getFirstNewsTitle())?.trim() ?? '';

    await newsPage.searchNews(firstTitle);
    await expect(newsPage.newsTitles.first()).toHaveText(firstTitle);

    await newsPage.clearSearch();
    await expect(newsPage.newsItems).toHaveCount(initialCount);
  });

  test('Rückgabewerte - jeder Schritt mit await', async () => {
    const firstItem = newsPage.getFirstNewsItem();
    const title = await firstItem.getTitle();
    const category = await firstItem.getCategory();

    // Keine Kette wie searchNews().filterByCategory(): jede Methode liefert ein Promise
    const searchResults = await newsPage.searchNews(title);
    const filtered = await searchResults.filterByCategory(category);
    await expect(filtered.getFirstNewsItem().title).toHaveText(title);
    await expect(filtered.getFirstNewsItem().category).toHaveText(category);

    await filtered.resetAllFilters();
    await expect(newsPage.newsItems).toHaveCount(20);
  });

  test('Suche nach dem Titel des zweiten Artikels', async () => {
    const title = await newsPage.getNewsItem(1).getTitle();

    await newsPage.searchNews(title);

    await expect(newsPage.newsItems).toHaveCount(1);
    await expect(newsPage.getNewsItem(0).title).toHaveText(title);
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

  test('Bonus A: Komponenten-Daten und Links', async () => {
    const articleData = await newsPage.getFirstNewsItem().getData();
    expect(articleData.title).toBeTruthy();
    expect(articleData.linkUrl).toMatch(/^(\/|http)/);

    const allItems = await newsPage.getAllNewsItems();
    for (const item of allItems.slice(0, 3)) {
      await expect(item.link).toHaveAttribute('target', '_blank');
    }
  });

  test('Lade-Status prüfen', async ({ page }) => {
    // Response zurückhalten, bis der Lade-Indikator geprüft ist –
    // deterministisch statt eines festen Delays (Muster aus Übung 15).
    let releaseResponse!: () => void;
    const responseReleased = new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });
    await page.route('**/api/news/public', async (route) => {
      await responseReleased;
      await route.fulfill({ path: 'app/api/feed.json' });
    });

    await page.reload();
    await expect(newsPage.loadingIndicator).toBeVisible();

    releaseResponse();
    await expect(newsPage.newsItems.first()).toBeVisible();
    await expect(newsPage.loadingIndicator).toBeHidden();
  });
});
