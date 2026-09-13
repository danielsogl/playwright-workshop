import { Page, Locator, expect } from '@playwright/test';

export class NewsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly newsFeed: Locator;
  readonly newsItems: Locator;
  readonly newsTitles: Locator;
  readonly categoryFilter: Locator;
  readonly resultsCount: Locator;

  constructor(page: Page) {
    this.page = page;

    // Zentrale Locator-Definitionen: aufgelöst wird erst bei der Aktion/Assertion
    this.searchInput = page.getByRole('textbox', {
      name: 'Search news articles',
    });

    this.newsFeed = page.getByRole('feed', { name: 'News articles' });

    this.newsItems = this.newsFeed.getByRole('article');

    // Für Assertions: expect(newsPage.newsTitles.first()).toHaveText(...)
    this.newsTitles = this.newsItems.getByRole('heading', { level: 2 });

    // Kategorie-Filter ist ein <select> → als combobox ansprechbar.
    this.categoryFilter = page.getByRole('combobox', {
      name: 'Filter news by category',
    });

    // Ergebniszähler „{n} articles found"
    this.resultsCount = page.getByText(/\d+ articles found/);
  }

  // Navigation
  async goto() {
    await this.page.goto('/news/public');
    await this.waitForNewsItems();
  }

  // Web-First-Assertion statt networkidle. Live-RSS-Feeds laden teils
  // mehrere Sekunden, daher mehr als die 5s Standard-Timeout.
  async waitForNewsItems() {
    await expect(this.newsItems.first()).toBeVisible({ timeout: 10_000 });
  }

  // Such-Aktionen: gefiltert wird clientseitig bei jeder Eingabe.
  // Kein networkidle/waitForTimeout: der Test wartet per toHaveCount/toHaveText.
  async searchNews(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  // Filter-Aktionen: der Kategorie-Filter ist ein <select> (combobox).
  async filterByCategory(category: string) {
    await this.categoryFilter.selectOption(category);
  }

  // Helper-Methoden für Daten. Für Assertions lieber die Locators
  // mit toHaveCount/toHaveText nutzen, die warten automatisch.
  async getNewsCount(): Promise<number> {
    return await this.newsItems.count();
  }

  async getFirstNewsTitle(): Promise<string | null> {
    return await this.newsTitles.first().textContent();
  }
}
