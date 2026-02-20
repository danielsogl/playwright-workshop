import { Page, Locator } from '@playwright/test';
import { NewsItemComponent } from './components/NewsItemComponent';

export class NewsPageAdvanced {
  readonly page: Page;
  private searchInput: Locator;
  private newsItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByRole('textbox', {
      name: 'Search news articles',
    });
    this.newsItems = page.getByRole('article');
  }

  // Fluent Navigation
  async goto(): Promise<this> {
    await this.page.goto('/news/public');
    await this.waitForNewsItems();
    return this;
  }

  // Fluent Search Actions
  async search(term: string): Promise<this> {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
    return this;
  }

  async clearSearch(): Promise<this> {
    await this.searchInput.clear();
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
    return this;
  }

  // Component-based access
  getNewsItem(index: number): NewsItemComponent {
    return new NewsItemComponent(this.newsItems.nth(index));
  }

  getFirstNewsItem(): NewsItemComponent {
    return new NewsItemComponent(this.newsItems.first());
  }

  getLastNewsItem(): NewsItemComponent {
    return new NewsItemComponent(this.newsItems.last());
  }

  async getAllNewsItems(): Promise<NewsItemComponent[]> {
    const count = await this.newsItems.count();
    const items: NewsItemComponent[] = [];

    for (let i = 0; i < count; i++) {
      items.push(new NewsItemComponent(this.newsItems.nth(i)));
    }

    return items;
  }

  // Fluent Filtering
  async filterByCategory(category: string): Promise<this> {
    const categoryFilter = this.page.getByRole('button', { name: category });
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      await this.page.waitForLoadState('networkidle');
    }
    return this;
  }

  async sortBy(criteria: 'date' | 'title' | 'author'): Promise<this> {
    const sortDropdown = this.page.getByRole('combobox', { name: /sort/i });
    if (await sortDropdown.isVisible()) {
      await sortDropdown.selectOption(criteria);
      await this.page.waitForLoadState('networkidle');
    }
    return this;
  }

  // Fluent Pagination
  async nextPage(): Promise<this> {
    const nextButton = this.page.getByRole('link', { name: /next|weiter/i });
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await this.page.waitForLoadState('networkidle');
    }
    return this;
  }

  async previousPage(): Promise<this> {
    const prevButton = this.page.getByRole('link', {
      name: /previous|zurück/i,
    });
    if (await prevButton.isVisible()) {
      await prevButton.click();
      await this.page.waitForLoadState('networkidle');
    }
    return this;
  }

  async goToPage(pageNumber: number): Promise<this> {
    const pageButton = this.page.getByRole('link', {
      name: String(pageNumber),
    });
    if (await pageButton.isVisible()) {
      await pageButton.click();
      await this.page.waitForLoadState('networkidle');
    }
    return this;
  }

  // Complex fluent operations
  async searchAndFilter(searchTerm: string, category: string): Promise<this> {
    await this.search(searchTerm);
    await this.filterByCategory(category);
    return this;
  }

  async resetAllFilters(): Promise<this> {
    await this.clearSearch();
    const resetButton = this.page.getByRole('button', {
      name: /reset|clear all/i,
    });
    if (await resetButton.isVisible()) {
      await resetButton.click();
      await this.page.waitForLoadState('networkidle');
    }
    return this;
  }

  // Data extraction with fluent interface
  async getCount(): Promise<number> {
    return await this.newsItems.count();
  }

  async getTitles(): Promise<string[]> {
    const items = await this.getAllNewsItems();
    return Promise.all(items.map((item) => item.getTitle()));
  }

  async getItemsData() {
    const items = await this.getAllNewsItems();
    return Promise.all(items.map((item) => item.getData()));
  }

  // Status checks
  async hasResults(): Promise<boolean> {
    return (await this.getCount()) > 0;
  }

  async isLoading(): Promise<boolean> {
    const spinner = this.page.getByRole('progressbar');
    const spinnerVisible = await spinner.isVisible().catch(() => false);
    if (!spinnerVisible) {
      // Fallback to class-based selectors if progressbar role not found
      const loadingIndicator = this.page.locator('.spinner, .loading');
      return await loadingIndicator.isVisible().catch(() => false);
    }
    return spinnerVisible;
  }

  // Wait helpers
  private async waitForNewsItems(): Promise<this> {
    await this.newsItems.first().waitFor({
      state: 'visible',
    });
    return this;
  }

  async waitForSearchResults(): Promise<this> {
    await this.page.waitForLoadState('networkidle');
    return this;
  }
}
