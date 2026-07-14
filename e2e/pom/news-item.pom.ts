import type { Locator } from "@playwright/test";

export class NewsItemComponent {
  readonly root: Locator;
  private readonly titleLink: Locator;
  private readonly description: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.titleLink = root.getByRole('link');
    this.description = root.locator('p');
  }

  async title(): Promise<string> {
    return (await this.titleLink.innerText()).trim();
  }

  async link(): Promise<string | null> {
    return this.titleLink.getAttribute('href');
  }

  async source(): Promise<string> {
    return (await this.chips().first().innerText()).trim();
  }

  async descriptionText(): Promise<string> {
    return (await this.description.innerText()).trim();
  }

  async open(): Promise<void> {
    await this.titleLink.click();
  }

  private chips(): Locator {
    return this.root.locator('[data-slot="chip"], .chip');
  }
}
