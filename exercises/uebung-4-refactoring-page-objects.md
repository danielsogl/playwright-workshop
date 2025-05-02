# Übung 4 – Refactoring mit Page Objects

**Ziel:**
Du refaktorierst die bestehenden Tests für die Public News Seite der Feed App (aus Übung 2) mithilfe des Page Object Models (POM), um die Testlogik von den UI-Interaktionsdetails zu trennen und die Wartbarkeit zu verbessern.

**Aufgaben:**

1.  **Page Object Klasse erstellen:**
    -   Erstelle eine neue Datei für das Page Object, z.B. `e2e/pages/PublicNewsPage.ts`.
    -   Definiere eine Klasse `PublicNewsPage`.
    -   Füge einen Konstruktor hinzu, der die Playwright `Page`-Instanz entgegennimmt und speichert (`readonly page: Page`).
2.  **Selektoren kapseln:**
    -   Definiere Locators für die wichtigen Elemente der Public News Seite als Eigenschaften der `PublicNewsPage`-Klasse. Nutze ausschließlich semantische, benutzerorientierte Selektoren:
        ```typescript
        readonly searchInput = this.page.getByRole('textbox', { name: /search/i });
        readonly categorySelect = this.page.getByRole('combobox', { name: /category/i });
        readonly newsGrid = this.page.getByRole('list', { name: /news/i });
        readonly newsItems = this.newsGrid.getByRole('listitem'); // Locator für alle News-Karten
        readonly loadingIndicator = this.page.getByRole('status', { name: /loading/i }); // Optional, falls benötigt
        readonly errorIndicator = this.page.getByRole('alert'); // Optional, falls benötigt
        ```
3.  **Interaktionsmethoden erstellen:**
    -   Implementiere Methoden in `PublicNewsPage`, die Benutzeraktionen kapseln:
        -   `goto()`: Navigiert zur Public News Seite (`/news/public`).
        -   `searchNews(query: string)`: Gibt den Suchbegriff in das Suchfeld ein.
        -   `filterByCategory(categoryLabel: string)`: Wählt eine Kategorie im Dropdown aus.
        -   `waitForNewsToLoad()`: Wartet darauf, dass der News-Grid sichtbar ist (oder der Ladeindikator verschwindet).
4.  **Hilfsmethoden für Assertions:**
    -   Implementiere Methoden, die Zustände oder Daten von der Seite zurückgeben, damit die Tests darauf prüfen können:
        -   `getNewsItemLocators()`: Gibt einen Locator zurück, der alle sichtbaren News-Item-Elemente repräsentiert (`this.newsItems`).
        -   `getNewsItemCount(): Promise<number>`: Gibt die Anzahl der sichtbaren News-Items zurück (`this.newsItems.count()`).
        -   `getNewsItemTitle(index: number): Promise<string | null>`: Gibt den Titel eines spezifischen News-Items zurück (z.B. über `this.newsItems.nth(index).getByRole('link').textContent()`).
        -   `getNewsItemCategory(index: number): Promise<string | null>`: Gibt die Kategorie eines spezifischen News-Items zurück (z.B. über `this.newsItems.nth(index).getByText(/category/i).textContent()`).
5.  **Tests refaktorieren:**
    -   Gehe zurück zu deiner Testdatei für den News Feed (z.B. `news-feed.spec.ts` aus Übung 2).
    -   Importiere die `PublicNewsPage`-Klasse.
    -   Erstelle in jedem Test (oder in einem `beforeEach`-Hook) eine Instanz von `PublicNewsPage`: `const publicNewsPage = new PublicNewsPage(page);`.
    -   Ersetze die direkten `page`-Aufrufe (wie `page.goto`, `page.getByTestId`, `page.selectOption`) durch Aufrufe der entsprechenden Methoden des `publicNewsPage`-Objekts (z.B. `await publicNewsPage.goto()`, `await publicNewsPage.searchNews('Tech')`, `await publicNewsPage.filterByCategory('Technology')`).
    -   Passe die Assertions an, um die Hilfsmethoden des Page Objects zu verwenden (z.B. `expect(await publicNewsPage.getNewsItemCount()).toBeGreaterThan(0);`, `expect(await publicNewsPage.getNewsItemCategory(0)).toBe('Technology');`).
6.  **Tests ausführen:**
    -   Stelle sicher, dass die refaktorierten Tests immer noch erfolgreich durchlaufen.

**Zeit:** 30 Minuten

---

> **Tipp:** Halte die Page Object Methoden fokussiert auf Interaktion (`searchNews`) und Datenextraktion (`getNewsItemCount`). Die eigentlichen `expect`-Assertions gehören in die Testfälle, nicht in das Page Object. Verwende ausschließlich semantische, benutzerorientierte Selektoren (`getByRole`, `getByLabel`, `getByText`, etc.).
