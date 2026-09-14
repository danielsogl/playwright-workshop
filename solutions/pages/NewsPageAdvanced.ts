import { Page, Locator, expect } from '@playwright/test';
import { NewsItemComponent } from './components/NewsItemComponent';

export class NewsPageAdvanced {
  readonly page: Page;
  // Für Assertions: expect(newsPage.newsItems).toHaveCount(...)
  readonly newsItems: Locator;
  readonly loadingIndicator: Locator;
  private readonly searchInput: Locator;
  private readonly categoryFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newsItems = page
      .getByRole('feed', { name: 'News articles' })
      .getByRole('article');
    this.loadingIndicator = page.getByRole('status', {
      name: 'Loading news feed',
    });
    this.searchInput = page.getByRole('textbox', {
      name: 'Search news articles',
    });
    this.categoryFilter = page.getByRole('combobox', {
      name: 'Filter news by category',
    });
  }

  // Methoden geben this zurück (Promise<this>): im Test jeden Schritt awaiten
  async goto(): Promise<this> {
    await this.page.goto('/news/public');
    // Live-RSS-Feeds laden teils mehrere Sekunden (expect.timeout in der Config)
    await expect(this.newsItems.first()).toBeVisible();
    return this;
  }

  // Suche und Filter arbeiten clientseitig: kein networkidle nötig
  async search(term: string): Promise<this> {
    await this.searchInput.fill(term);
    return this;
  }

  async clearSearch(): Promise<this> {
    await this.searchInput.clear();
    return this;
  }

  async filterByCategory(category: string): Promise<this> {
    await this.categoryFilter.selectOption(category);
    return this;
  }

  async searchAndFilter(searchTerm: string, category: string): Promise<this> {
    await this.search(searchTerm);
    await this.filterByCategory(category);
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
    return new NewsItemComponent(this.newsItems.first());
  }

  async getAllNewsItems(): Promise<NewsItemComponent[]> {
    const items = await this.newsItems.all();
    return items.map((item) => new NewsItemComponent(item));
  }

  // Helper für Werte, die im Test weiterverwendet werden
  async getCount(): Promise<number> {
    return await this.newsItems.count();
  }

  async getTitles(): Promise<string[]> {
    const items = await this.getAllNewsItems();
    return Promise.all(items.map((item) => item.getTitle()));
  }
}
