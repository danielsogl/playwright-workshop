import type { Page } from "@playwright/test";

export class BasePage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForURL(url);
  }
}
