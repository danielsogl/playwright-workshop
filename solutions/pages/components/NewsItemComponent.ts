import { Locator } from '@playwright/test';

export class NewsItemComponent {
  // Sub-Elemente als readonly Locators: für Assertions wie
  // expect(item.title).toHaveText(...) statt textContent()-Getter
  readonly title: Locator;
  readonly link: Locator;
  readonly description: Locator;
  readonly author: Locator;
  readonly date: Locator;
  readonly category: Locator;

  constructor(readonly root: Locator) {
    this.title = root.getByRole('heading', { level: 2 });
    // Link liegt in der Überschrift
    this.link = this.title.getByRole('link');
    this.description = root.locator('p');
    // Quelle wird als Chip mit exaktem Namen gerendert
    this.author = root.getByText(
      /^(TechCrunch|Reuters Financial News|BBC World|Hacker News)$/,
    );
    // Datum im deutschen Langformat, z. B. "4. Oktober 2025"
    this.date = root.getByText(/^(\d{1,2}\.\s\S+\s\d{4}|Date unavailable)$/);
    this.category = root.getByText(/^(Technology|Business|World News)$/);
  }

  // Aktionen geben this zurück (Promise<this>)
  async hover(): Promise<this> {
    await this.root.hover();
    return this;
  }

  // Öffnet den Artikel in einem neuen Tab (target="_blank")
  async clickLink(): Promise<this> {
    await this.link.click();
    return this;
  }

  // Helper für Werte, die im Test weiterverwendet werden
  async getTitle(): Promise<string> {
    return (await this.title.textContent())?.trim() ?? '';
  }

  async getDescription(): Promise<string> {
    return (await this.description.textContent())?.trim() ?? '';
  }

  async getAuthor(): Promise<string> {
    return (await this.author.textContent())?.trim() ?? '';
  }

  async getDate(): Promise<string> {
    return (await this.date.textContent())?.trim() ?? '';
  }

  async getCategory(): Promise<string> {
    return (await this.category.textContent())?.trim() ?? '';
  }

  async getLinkUrl(): Promise<string | null> {
    return await this.link.getAttribute('href');
  }

  // Alle Daten als Objekt
  async getData() {
    return {
      title: await this.getTitle(),
      description: await this.getDescription(),
      author: await this.getAuthor(),
      date: await this.getDate(),
      category: await this.getCategory(),
      linkUrl: await this.getLinkUrl(),
    };
  }
}
