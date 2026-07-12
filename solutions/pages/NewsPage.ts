import { Page, Locator } from '@playwright/test';

export class NewsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly newsItems: Locator;
  readonly loadMoreButton: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Zentrale Locator-Definitionen - use exact selectors
    this.searchInput = page.getByRole('textbox', {
      name: 'Search news articles',
    });

    this.newsItems = page.getByRole('article');

    this.loadMoreButton = page.getByRole('button', {
      name: /load more|mehr laden/i,
    });

    this.noResultsMessage = page.getByText(
      /no results|keine ergebnisse|nothing found/i,
    );
  }

  // Navigation
  async goto() {
    await this.page.goto('/news/public'); // Fixed: use correct URL
    await this.waitForNewsItems();
  }

  // Warte-Funktionen
  async waitForNewsItems() {
    // Wait for at least one news item to be visible
    await this.newsItems.first().waitFor({
      state: 'visible',
      timeout: 10000,
    });
  }

  // Such-Aktionen
  async searchNews(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }

  // Daten-Extraktion
  async getNewsCount(): Promise<number> {
    return await this.newsItems.count();
  }

  async getNewsTitles(): Promise<string[]> {
    const titles: string[] = [];
    const count = await this.newsItems.count();

    for (let i = 0; i < count; i++) {
      const item = this.newsItems.nth(i);
      const titleElement = item
        .locator('h2, h3, [role="heading"], .title')
        .first();

      if ((await titleElement.count()) > 0) {
        const text = await titleElement.textContent();
        if (text) titles.push(text.trim());
      }
    }

    return titles;
  }

  async getFirstNewsItem(): Promise<Locator> {
    return this.newsItems.first();
  }

  // Status-Prüfungen
  async hasNoResults(): Promise<boolean> {
    const hasNoItems = (await this.newsItems.count()) === 0;
    const hasMessage = await this.noResultsMessage
      .isVisible({ timeout: 1000 })
      .catch(() => false);
    return hasNoItems || hasMessage;
  }

  async canLoadMore(): Promise<boolean> {
    return await this.loadMoreButton
      .isVisible({ timeout: 1000 })
      .catch(() => false);
  }

  // Interaktionen
  async loadMoreNews() {
    if (await this.canLoadMore()) {
      await this.loadMoreButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async clickFirstNewsItem() {
    const firstItem = await this.getFirstNewsItem();
    const link = firstItem.locator('a').first();
    if ((await link.count()) > 0) {
      await link.click();
    }
  }

  // Filter-Aktionen
  async filterByCategory(category: string) {
    const categoryButton = this.page.getByRole('button', { name: category });
    if (await categoryButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await categoryButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }
}
