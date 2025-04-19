# Übung 4 – Refactoring mit Page Objects

**Ziel:**
Du refaktorierst die bestehenden Tests für die Public News Seite der Feed App (aus Übung 2) mithilfe des Page Object Models (POM), um die Testlogik von den UI-Interaktionsdetails zu trennen und die Wartbarkeit zu verbessern.

**Aufgaben:**

1.  **Page Object Klasse erstellen:**
    -   Lege eine Datei für das Page Object an, z.B. `e2e/pages/PublicNewsPage.ts`.
    -   Definiere eine Klasse `PublicNewsPage` mit Konstruktor, der die Playwright `Page`-Instanz entgegennimmt (`readonly page: Page`).

2.  **Selektoren kapseln:**
    -   Definiere Locators für die wichtigsten Elemente der Public News Seite als Eigenschaften der Klasse. Nutze semantische, benutzerorientierte Selektoren, z.B.:
        ```typescript
        readonly searchInput = this.page.getByRole('textbox', { name: /search/i });
        readonly categorySelect = this.page.getByRole('combobox', { name: /category/i });
        readonly newsGrid = this.page.getByRole('list', { name: /news/i });
        readonly newsItems = this.newsGrid.getByRole('listitem');
        readonly loadingIndicator = this.page.getByRole('status', { name: /loading/i });
        readonly errorIndicator = this.page.getByRole('alert');
        ```

3.  **Interaktionsmethoden erstellen:**
    -   Implementiere Methoden für Benutzeraktionen:
        -   `goto()`: Navigiert zur Public News Seite (`/news/public`).
        -   `searchNews(query: string)`: Gibt den Suchbegriff in das Suchfeld ein.
        -   `filterByCategory(categoryLabel: string)`: Wählt eine Kategorie im Dropdown aus.
        -   `waitForNewsToLoad()`: Wartet darauf, dass der News-Grid sichtbar ist oder der Ladeindikator verschwindet.

4.  **Hilfsmethoden für Assertions:**
    -   Implementiere Methoden, die Daten von der Seite zurückgeben:
        -   `getNewsItemLocators()`: Gibt einen Locator für alle sichtbaren News-Items zurück.
        -   `getNewsItemCount(): Promise<number>`: Gibt die Anzahl der sichtbaren News-Items zurück.
        -   `getNewsItemTitle(index: number): Promise<string | null>`: Gibt den Titel eines spezifischen News-Items zurück.
        -   `getNewsItemCategory(index: number): Promise<string | null>`: Gibt die Kategorie eines spezifischen News-Items zurück.

5.  **Tests refaktorieren:**
    -   Öffne die Testdatei für den News Feed (z.B. `e2e/news/news-feed.spec.ts`).
    -   Importiere die `PublicNewsPage`-Klasse.
    -   Erstelle in jedem Test (oder im `beforeEach`) eine Instanz von `PublicNewsPage`.
    -   Ersetze direkte `page`-Aufrufe durch Methoden des Page Objects.
    -   Verwende die Hilfsmethoden des Page Objects für Assertions.

6.  **Tests ausführen:**
    -   Stelle sicher, dass die refaktorierten Tests erfolgreich durchlaufen.

**Zeit:** 30 Minuten

---

> **Tipp:** Halte die Page Object Methoden fokussiert auf Interaktion und Datenextraktion. Die eigentlichen `expect`-Assertions gehören in die Testfälle, nicht in das Page Object. Verwende ausschließlich semantische, benutzerorientierte Selektoren (`getByRole`, `getByLabel`, `getByText`, etc.).
