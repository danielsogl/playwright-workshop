import { Page, Locator, expect } from '@playwright/test';
import { NewsItemComponent } from './components/NewsItemComponent';

export class NewsPageAdvanced {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly newsFeed: Locator;
  readonly newsItems: Locator;
  readonly newsTitles: Locator;
  readonly categoryFilter: Locator;
  readonly resultsCount: Locator;
  readonly loadingIndicator: Locator;

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

    this.loadingIndicator = page.getByRole('status', {
      name: 'Loading news feed',
    });
  }

  // Methoden geben this zurück (Promise<this>): im Test jeden Schritt awaiten
  async goto(): Promise<this> {
    await this.page.goto('/news/public');
    await this.waitForNewsItems();
    return this;
  }

  // Web-First-Assertion statt networkidle. Live-RSS-Feeds laden teils
  // mehrere Sekunden, dafür ist expect.timeout in playwright.config.ts erhöht.
  async waitForNewsItems() {
    await expect(this.newsItems.first()).toBeVisible();
  }

  // Such-Aktionen: gefiltert wird clientseitig bei jeder Eingabe.
  // Kein networkidle/waitForTimeout: der Test wartet per toHaveCount/toHaveText.
  async searchNews(searchTerm: string): Promise<this> {
    await this.searchInput.fill(searchTerm);
    return this;
  }

  async clearSearch(): Promise<this> {
    await this.searchInput.clear();
    return this;
  }

  // Filter-Aktionen: der Kategorie-Filter ist ein <select> (combobox).
  async filterByCategory(category: string): Promise<this> {
    await this.categoryFilter.selectOption(category);
    return this;
  }

  async resetAllFilters(): Promise<this> {
    await this.clearSearch();
    await this.categoryFilter.selectOption({ label: 'All Categories' });
    return this;
  }

  // Component-based access
  getNewsItem(index: number): NewsItemComponent {
    return new NewsItemComponent(this.newsItems.nth(index));
  }

  getFirstNewsItem(): NewsItemComponent {
    return this.getNewsItem(0);
  }

  async getAllNewsItems(): Promise<NewsItemComponent[]> {
    const items = await this.newsItems.all();
    return items.map((item) => new NewsItemComponent(item));
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
