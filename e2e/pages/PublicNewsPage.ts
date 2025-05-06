import { Locator, Page } from '@playwright/test';

/**
 * Page Object for the Public News page
 */
export class PublicNewsPage {
  // Element locators
  readonly searchInput: Locator;
  readonly categorySelect: Locator;
  readonly newsGrid: Locator;
  readonly newsItems: Locator;
  readonly loadingIndicator: Locator;
  readonly errorIndicator: Locator;

  constructor(readonly page: Page) {
    // Initialize locators based on the selectors used in the existing tests
    this.searchInput = this.page.getByRole('textbox', { name: 'Search news' });
    this.categorySelect = this.page.getByLabel('Filter news by category');
    this.newsGrid = this.page.getByRole('list', { name: 'News articles' });
    this.newsItems = this.newsGrid.getByRole('listitem');
    this.loadingIndicator = this.page
      .getByRole('status', {
        name: 'Loading news feed',
      })
      .nth(1);
    this.errorIndicator = this.page.getByText('Failed to load RSS feeds');
  }

  /**
   * Navigate to the Public News page
   */
  async goto() {
    await this.page.goto('/news/public');
  }

  /**
   * Search for news by query
   * @param query The search query
   */
  async searchNews(query: string) {
    await this.searchInput.fill(query);
  }

  /**
   * Filter news by category
   * @param categoryLabel The category label to select
   */
  async filterByCategory(categoryLabel: string) {
    await this.categorySelect.selectOption({ label: categoryLabel });
  }

  /**
   * Wait for news to load
   */
  async waitForNewsToLoad() {
    // Wait for the grid to be visible
    await this.newsGrid.waitFor({ state: 'visible' });

    // If loading indicator exists, wait for it to disappear
    try {
      await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 });
    } catch {
      // Ignore if loading indicator is not found
    }
  }

  /**
   * Get locator for all news items
   */
  getNewsItemLocators() {
    return this.newsItems;
  }

  /**
   * Get the count of news items
   */
  async getNewsItemCount(): Promise<number> {
    return await this.newsItems.count();
  }

  /**
   * Get the title of a specific news item
   * @param index The index of the news item
   */
  async getNewsItemTitle(index: number): Promise<string | null> {
    const titleElement = this.newsItems.nth(index).getByRole('heading').first();
    return await titleElement.textContent();
  }

  /**
   * Get the category of a specific news item
   * @param index The index of the news item
   */
  async getNewsItemCategory(index: number): Promise<string | null> {
    const categoryElement = this.newsItems
      .nth(index)
      .getByText(/Technology|Business|Sports|Entertainment|Health|Science/i);
    return await categoryElement.textContent();
  }
}
