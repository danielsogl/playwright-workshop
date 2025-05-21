import { Locator } from '@playwright/test';

export class NewsItem {
  private header: Locator;
  private newsTeaser: Locator;

  constructor(root: Locator) {
    this.header = root.getByRole('heading', { level: 2 });
    this.newsTeaser = root.getByRole('paragraph');
  }

  async getHeader() {
    return this.header.textContent();
  }

  async getNewsTeaser() {
    return this.newsTeaser.textContent();
  }
}
