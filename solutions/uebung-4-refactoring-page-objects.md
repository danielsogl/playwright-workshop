# Lösung: Übung 4 – Refactoring mit Page Objects

## Hinweise zur Codebasis
- Lege Page Objects in `e2e/utils/` ab, z.B. `e2e/utils/PublicNewsPage.ts`.
- Testdateien liegen in `e2e/news/news-feed.spec.ts`.
- Verwende das Page Object Model (POM) für Wiederverwendbarkeit und Wartbarkeit.

## Beispiel für Page Object (`e2e/utils/PublicNewsPage.ts`)
```typescript
import { Page, Locator } from '@playwright/test';

export class PublicNewsPage {
  constructor(private readonly page: Page) {}

  readonly searchInput = this.page.getByRole('textbox', { name: /search/i });
  readonly categorySelect = this.page.getByRole('combobox', { name: /category/i });
  readonly newsGrid = this.page.getByRole('list', { name: /news/i });
  readonly newsItems = this.newsGrid.getByRole('listitem');

  async goto() {
    await this.page.goto('/news/public');
  }

  async searchNews(query: string) {
    await this.searchInput.fill(query);
  }

  async filterByCategory(categoryLabel: string) {
    await this.categorySelect.selectOption({ label: categoryLabel });
  }

  async waitForNewsToLoad() {
    await this.newsGrid.waitFor({ state: 'visible' });
  }

  async getNewsItemCount(): Promise<number> {
    return await this.newsItems.count();
  }

  async getNewsItemTitle(index: number): Promise<string | null> {
    return await this.newsItems.nth(index).getByRole('heading').textContent();
  }

  async getNewsItemCategory(index: number): Promise<string | null> {
    return await this.newsItems.nth(index).getByText(/category/i).textContent();
  }
}
```

## Beispiel für refaktorierten Test (`e2e/news/news-feed.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';
import { PublicNewsPage } from '../../utils/PublicNewsPage';

test('Filter- und Suchfunktion im News Feed (POM)', async ({ page }) => {
  const newsPage = new PublicNewsPage(page);
  await newsPage.goto();
  await newsPage.waitForNewsToLoad();

  // Suche
  await newsPage.searchNews('Tech');
  expect(await newsPage.getNewsItemCount()).toBeGreaterThan(0);
  expect(await newsPage.getNewsItemTitle(0)).toMatch(/tech/i);

  // Filter
  await newsPage.filterByCategory('Technology');
  expect(await newsPage.getNewsItemCategory(0)).toMatch(/technology/i);
});
```

---
**Best Practices:**
- Lege Page Objects in `e2e/utils/` ab.
- Testdateien nach Domain in `e2e/<domain>/` ablegen.
- Assertions und Testlogik bleiben im Testfile, nicht im Page Object.
- Nutze ausschließlich semantische Selektoren im Page Object.
