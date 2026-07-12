# Übung 4 – Page Object Model (POM)

**Ziel:**
Du refaktorierst die Tests aus Übung 2 mit dem Page Object Pattern. Dies verbessert die Wartbarkeit und Wiederverwendbarkeit deines Test-Codes.

**Warum Page Objects?**

- Trennung von Test-Logik und UI-Details
- Zentrale Stelle für Selektoren
- Wiederverwendbare Aktionen
- Einfachere Wartung bei UI-Änderungen

**Aufgaben:**

1. **Einfaches Page Object erstellen:**

   ```typescript
   // e2e/pages/NewsPage.ts
   import { Page, Locator } from '@playwright/test';

   export class NewsPage {
     // Speichere Page-Referenz
     constructor(private page: Page) {}

     // Definiere Locators als Getter (lazy loading)
     get searchInput() {
       return this.page.getByRole('textbox', { name: 'Search news' });
     }

     get newsList() {
       return this.page.getByRole('feed', { name: 'News articles' });
     }

     get newsItems() {
       return this.newsList.getByRole('article');
     }

     get loadingIndicator() {
       return this.page.getByRole('status', { name: /loading/i });
     }

     // Navigations-Methode
     async goto() {
       await this.page.goto('/news/public');
       // Warte bis Seite geladen ist
       await this.newsList.waitFor();
     }

     // Aktions-Methoden
     async searchNews(searchTerm: string) {
       await this.searchInput.fill(searchTerm);
       // Warte bis Suche angewendet wurde
       await this.page.waitForLoadState('networkidle');
     }

     async clearSearch() {
       await this.searchInput.clear();
     }

     // Helper-Methoden für Daten
     async getNewsCount(): Promise<number> {
       return await this.newsItems.count();
     }

     async getFirstNewsTitle(): Promise<string | null> {
       const firstItem = this.newsItems.first();
       return await firstItem.textContent();
     }
   }
   ```

2. **Tests mit Page Object refaktorieren:**

   ```typescript
   // e2e/news-with-pom.spec.ts
   import { test, expect } from '@playwright/test';
   import { NewsPage } from './pages/NewsPage';

   test.describe('News Feed mit Page Objects', () => {
     let newsPage: NewsPage;

     test.beforeEach(async ({ page }) => {
       newsPage = new NewsPage(page);
       await newsPage.goto();
     });

     test('zeigt alle News initial', async () => {
       // Verwende Page Object Methoden
       const count = await newsPage.getNewsCount();
       expect(count).toBe(65);

       // Verwende Page Object Locators
       await expect(newsPage.newsItems.first()).toBeVisible();
     });

     test('kann nach News suchen', async () => {
       // Initiale Anzahl prüfen
       expect(await newsPage.getNewsCount()).toBe(65);

       // Suche durchführen
       await newsPage.searchNews('Technology');

       // Ergebnisse prüfen
       const count = await newsPage.getNewsCount();
       expect(count).toBeLessThan(65);
       expect(count).toBeGreaterThan(0);

       // Suche zurücksetzen
       await newsPage.clearSearch();
       expect(await newsPage.getNewsCount()).toBe(65);
     });

     test('findet spezifischen Artikel', async () => {
       await newsPage.searchNews('Revelo');

       expect(await newsPage.getNewsCount()).toBe(1);

       const title = await newsPage.getFirstNewsTitle();
       expect(title).toContain('Revelo');
     });
   });
   ```

3. **Page Object erweitern (optional):**

   ```typescript
   export class NewsPage {
     // ... vorherige Definitionen ...

     // Erweiterte Funktionalität
     get categoryFilter() {
       return this.page.getByLabel('Filter news by category');
     }

     async filterByCategory(category: string) {
       await this.categoryFilter.selectOption(category);
       await this.page.waitForLoadState('networkidle');
     }

     async waitForNewsToLoad() {
       await this.loadingIndicator.waitFor({ state: 'hidden' });
       await this.newsList.waitFor({ state: 'visible' });
     }

     // Assertions im Page Object (optional)
     async expectNewsCount(count: number) {
       await expect(this.newsItems).toHaveCount(count);
     }

     async expectSearchInputValue(value: string) {
       await expect(this.searchInput).toHaveValue(value);
     }
   }
   ```

4. **Best Practices für Page Objects:**
   - ✅ Ein Page Object pro Seite/Komponente
   - ✅ Klare, beschreibende Methoden-Namen
   - ✅ Locators als Getter oder readonly Properties
   - ✅ Keine Test-Assertions in Page Objects (außer wait-Conditions)
   - ❌ Keine test-spezifische Logik
   - ❌ Nicht zu viele Details verstecken

5. **Tests ausführen:**
   ```bash
   npx playwright test news-with-pom.spec.ts
   ```

**Vergleich Vorher/Nachher:**

```typescript
// Ohne POM:
await page.getByRole('textbox', { name: 'Search news' }).fill('Tech');

// Mit POM:
await newsPage.searchNews('Tech');
```

**Zeit:** 25 Minuten

---

> **Tipp:** Beginne mit einfachen Page Objects und erweitere sie schrittweise. Nicht alles muss von Anfang an perfekt abstrahiert sein!
