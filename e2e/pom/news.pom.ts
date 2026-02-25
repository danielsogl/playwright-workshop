import type { Locator, Page } from "@playwright/test";

export class NewsItem {
  private locator: Locator;

  private title: Locator;
  private description: Locator;
  private author: Locator;
  private date: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.title = locator.getByRole("heading", { name: "News item title" });
    this.description = locator.getByText("News item description");
    this.author = locator.getByText("News item author");
    this.date = locator.getByText("News item date");
  }

  async openLink() {
    await this.locator.click();
  }
}


export class NewsPage {

  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getNewsItemAt(index: number): Promise<NewsItem> {
    const newsItemLocator = this.page.locator(".news-item").nth(index);
    return new NewsItem(newsItemLocator);
  }
}