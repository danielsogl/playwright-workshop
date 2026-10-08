import { Locator } from '@playwright/test';

export class NewsItemComponent {
  // Sub-Elemente als readonly Locators: für Assertions wie
  // expect(item.title).toHaveText(...) statt textContent()-Getter
  readonly title: Locator;
  readonly link: Locator;
  readonly category: Locator;
  readonly description: Locator;

  constructor(readonly root: Locator) {
    this.title = root.getByRole('heading', { level: 2 });
    // Link liegt in der Überschrift
    this.link = this.title.getByRole('link');
    this.category = root.getByText(/^(Technology|Business|World News)$/);
    this.description = root.getByRole('paragraph');
  }

  // Helper für Werte, die im Test weiterverwendet werden
  async getTitle(): Promise<string> {
    return (await this.title.textContent())?.trim() ?? '';
  }

  async getCategory(): Promise<string> {
    return (await this.category.textContent())?.trim() ?? '';
  }

  // Bonus A: alle Werte als Objekt
  async getData() {
    return {
      title: await this.getTitle(),
      category: await this.getCategory(),
      description: (await this.description.textContent())?.trim() ?? '',
      linkUrl: await this.link.getAttribute('href'),
    };
  }
}
