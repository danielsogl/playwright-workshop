import type { Locator, Page } from "@playwright/test";

import { NewsItemComponent } from "./news-item.pom";

export class PublicNewsPage {
  private readonly page: Page;
  private readonly searchInput: Locator;
  private readonly categorySelect: Locator;
  private readonly resultsCount: Locator;
  private readonly feed: Locator;
  readonly loading: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByRole('textbox', { name: 'Search news articles' });
    this.categorySelect = page.getByRole('combobox', { name: 'Filter news by category' });
    this.resultsCount = page.getByText(/articles found/);
    this.feed = page.getByRole('feed', { name: 'News articles' });
    this.loading = page.getByRole('status', { name: 'Loading news feed' });
    this.errorAlert = page.getByRole('alert', { name: 'Failed to load RSS feeds' });
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/news/public');
    await this.page.waitForURL('/news/public');
    // await this.loading.waitFor({ state: 'hidden' });
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async selectCategory(category: string): Promise<void> {
    await this.categorySelect.selectOption(category);
  }

  async resultsText(): Promise<string> {
    return (await this.resultsCount.innerText()).trim();
  }

  items(): Locator {
    return this.feed.getByRole('article');
  }

  item(index: number): NewsItemComponent {
    return new NewsItemComponent(this.items().nth(index));
  }

  itemByTitle(title: string): NewsItemComponent {
    return new NewsItemComponent(this.items().filter({ hasText: title }));
  }

  async hasError(): Promise<boolean> {
    return this.errorAlert.isVisible();
  }
}
