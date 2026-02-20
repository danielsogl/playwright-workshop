import { Locator } from '@playwright/test';

export class NewsItemComponent {
  constructor(private readonly locator: Locator) {}

  // Getter for sub-elements
  get title() {
    // News items have the heading with the link text
    return this.locator.getByRole('heading', { level: 2 }).first();
  }

  get description() {
    // Description is in a paragraph element
    return this.locator.locator('p').first();
  }

  get link() {
    // Link is within the heading
    return this.locator.getByRole('link').first();
  }

  get author() {
    // Source text - look for the first element that contains only the source name
    return this.locator
      .locator(
        ':text-matches("^(TechCrunch|Reuters Financial News|BBC World|Hacker News)$")',
      )
      .first();
  }

  get date() {
    // Date text appears as "10/4/2025" in the browser
    return this.locator
      .locator('text=/^\\d{1,2}\\/\\d{1,2}\\/\\d{4}$/')
      .first();
  }

  get image() {
    return this.locator.getByRole('img').first();
  }

  get category() {
    // Category appears as exact text like "Technology", "Business", "World News"
    return this.locator
      .locator('text=/^(Technology|Business|World News)$/')
      .first();
  }

  // Actions with fluent interface
  async hover(): Promise<this> {
    await this.locator.hover();
    return this;
  }

  async click(): Promise<this> {
    await this.locator.click();
    return this;
  }

  async clickLink(): Promise<this> {
    await this.link.click();
    return this;
  }

  // Data extraction methods
  async getTitle(): Promise<string> {
    try {
      // First try to get text from heading element
      const heading = this.locator.getByRole('heading', { level: 2 }).first();
      const headingText = await heading.textContent();
      if (headingText && headingText.trim()) return headingText.trim();

      // If heading is empty, try link text
      const link = this.locator.getByRole('link').first();
      const linkText = await link.textContent();
      if (linkText && linkText.trim()) return linkText.trim();

      // Fallback to any text content in the item
      const anyText = await this.locator.textContent();
      return anyText?.split('\n')[0]?.trim() || '';
    } catch {
      return '';
    }
  }

  async getDescription(): Promise<string> {
    try {
      return (await this.description.textContent()) || '';
    } catch {
      return '';
    }
  }

  async getAuthor(): Promise<string> {
    try {
      const sourceText = (await this.author.textContent()) || '';
      return sourceText.trim();
    } catch {
      return '';
    }
  }

  async getDate(): Promise<string> {
    try {
      const dateText = (await this.date.textContent()) || '';
      return dateText.trim();
    } catch {
      return '';
    }
  }

  async getCategory(): Promise<string> {
    try {
      const categoryText = (await this.category.textContent()) || '';
      return categoryText.trim();
    } catch {
      return '';
    }
  }

  async getImageUrl(): Promise<string | null> {
    try {
      const hasImg = await this.hasImage();
      if (!hasImg) return null;
      return await this.image.getAttribute('src');
    } catch {
      return null;
    }
  }

  async getLinkUrl(): Promise<string | null> {
    try {
      return await this.link.getAttribute('href');
    } catch {
      return null;
    }
  }

  // Status checks
  async isVisible(): Promise<boolean> {
    return await this.locator.isVisible();
  }

  async hasImage(): Promise<boolean> {
    return await this.image.isVisible().catch(() => false);
  }

  async hasCategory(category: string): Promise<boolean> {
    const categoryText = await this.getCategory();
    return categoryText.toLowerCase().includes(category.toLowerCase());
  }

  // Complex interactions with chaining
  async expandAndRead(): Promise<this> {
    await this.hover();
    const expandButton = this.locator.getByRole('button', {
      name: /expand|more|read/i,
    });
    if (await expandButton.isVisible().catch(() => false)) {
      await expandButton.click();
    }
    return this;
  }

  async shareVia(platform: 'twitter' | 'facebook' | 'linkedin'): Promise<this> {
    await this.hover();
    const shareButton = this.locator.getByRole('button', {
      name: new RegExp(platform, 'i'),
    });
    if (await shareButton.isVisible().catch(() => false)) {
      await shareButton.click();
    }
    return this;
  }

  // Get all data as object
  async getData() {
    return {
      title: await this.getTitle(),
      description: await this.getDescription(),
      author: await this.getAuthor(),
      date: await this.getDate(),
      category: await this.getCategory(),
      imageUrl: await this.getImageUrl(),
      linkUrl: await this.getLinkUrl(),
    };
  }
}
