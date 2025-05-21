import { expect, Locator, Page } from '@playwright/test';
import { NewsItem } from './news-item-pom';

export type NewsCategory = 'Technology' | 'Business' | 'World News';

export class NewsFeedPage {
  private page: Page;

  private newsFeedHeader: Locator;
  private searchInput: Locator;
  private filterOptions: Locator;

  private errorText: Locator;
  loadingSpinner: Locator;

  private newsList: Locator;
  private newsItems: Locator;

  constructor(page: Page) {
    this.page = page;

    this.newsFeedHeader = page.getByRole('heading', { name: 'News Feed' });
    this.searchInput = page.getByRole('textbox', {
      name: 'Search news articles',
    });
    this.filterOptions = page.getByLabel('Filter news by category');

    this.newsList = page.getByRole('list', { name: 'News articles' });
    this.newsItems = this.newsList.getByRole('listitem');

    this.errorText = page.getByRole('alert').first();
    this.loadingSpinner = page
      .getByRole('status', {
        name: 'Loading news feed',
      })
      .first();
  }

  async goToPage() {
    await this.page.goto('/news/public');
    await expect(this.page).toHaveURL('/news/public');
  }

  async filterByText(text: string) {
    await this.searchInput.fill(text);
  }

  async filterByCategory(category: NewsCategory) {
    await this.filterOptions.selectOption({ value: category });
    await expect(this.filterOptions).toHaveValue(category);
  }

  newsItemByTitle(title: string) {
    return new NewsItem(this.newsItems.getByRole('heading', { name: title }));
  }

  newsItemByIndex(index: number) {
    return new NewsItem(this.newsItems.nth(index));
  }

  async getErrorText() {
    return this.errorText.textContent();
  }

  countNewsItems() {
    return this.newsItems.count();
  }
}
