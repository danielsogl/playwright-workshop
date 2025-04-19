# Lösung: Übung 4B – Erweiterte Page Objects (Komponenten & Fluent Interface)

## Hinweise zur Codebasis
- Lege Komponenten-Objekte wie `NewsItemComponent` in `e2e/utils/components/` ab.
- Das Page Object `PublicNewsPage` liegt in `e2e/utils/PublicNewsPage.ts` und verwendet die Komponenten-Objekte.
- Testdateien liegen in `e2e/news/news-feed.spec.ts`.

## Beispiel für Komponenten-Objekt (`e2e/utils/components/NewsItemComponent.ts`)
```typescript
import { Locator } from '@playwright/test';

export class NewsItemComponent {
  constructor(private readonly root: Locator) {}

  get title() {
    return this.root.getByRole('heading');
  }
  get category() {
    return this.root.getByText(/category/i);
  }
  get description() {
    return this.root.getByRole('paragraph');
  }

  async getTitle() {
    return await this.title.textContent();
  }
  async getCategory() {
    return await this.category.textContent();
  }
  async getDescription() {
    return await this.description.textContent();
  }
  async clickTitle() {
    await this.title.click();
  }
}
```

## Beispiel für erweitertes Page Object (`e2e/utils/PublicNewsPage.ts`)
```typescript
import { Page } from '@playwright/test';
import { NewsItemComponent } from './components/NewsItemComponent';

export class PublicNewsPage {
  constructor(private readonly page: Page) {}

  readonly searchInput = this.page.getByRole('textbox', { name: /search/i });
  readonly categorySelect = this.page.getByRole('combobox', { name: /category/i });
  readonly newsGrid = this.page.getByRole('list', { name: /news/i });
  readonly newsItems = this.newsGrid.getByRole('listitem');

  async goto() { await this.page.goto('/news/public'); return this; }
  async searchNews(query: string) { await this.searchInput.fill(query); return this; }
  async filterByCategory(categoryLabel: string) { await this.categorySelect.selectOption({ label: categoryLabel }); return this; }
  async waitForNewsToLoad() { await this.newsGrid.waitFor({ state: 'visible' }); return this; }

  getNewsItem(index: number) {
    return new NewsItemComponent(this.newsItems.nth(index));
  }
  async getAllNewsItems() {
    const count = await this.newsItems.count();
    return Array.from({ length: count }, (_, i) => this.getNewsItem(i));
  }
}
```

## Beispiel für refaktorierten Test mit Fluent Interface (`e2e/news/news-feed.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';
import { PublicNewsPage } from '../../utils/PublicNewsPage';

test('News-Artikel-Komponenten und Fluent Interface', async ({ page }) => {
  const newsPage = new PublicNewsPage(page);
  await newsPage.goto().waitForNewsToLoad().searchNews('Tech').filterByCategory('Technology');

  const firstItem = newsPage.getNewsItem(0);
  expect(await firstItem.getTitle()).toMatch(/tech/i);
  expect(await firstItem.getCategory()).toMatch(/technology/i);
});
```

---
**Best Practices:**
- Lege Komponenten-Objekte in `e2e/utils/components/` ab.
- Nutze Fluent Interface für lesbare, verkettete Testaktionen.
- Assertions bleiben im Testfile, nicht im Page Object.
