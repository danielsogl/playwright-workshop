# Übung 4B – Erweiterte Page Objects (Komponenten & Fluent Interface)

**Ziel:**
Du verbesserst das Page Object Model für die Public News Seite der Feed App weiter, indem du wiederverwendbare Komponenten-Objekte für einzelne News-Artikel erstellst und das Fluent Interface Pattern für eine bessere Lesbarkeit und Verkettung von Aktionen anwendest.

**Aufgaben:**

1.  **NewsItem Komponenten-Objekt erstellen:**
    -   Erstelle eine neue Datei, z.B. `e2e/components/NewsItemComponent.ts`.
    -   Definiere eine Klasse `NewsItemComponent`.
    -   Der Konstruktor sollte einen `Locator` entgegennehmen, der auf das `div`- oder `Card`-Element eines einzelnen News-Artikels zeigt (`readonly root: Locator`). Verwende den Locator aus `PublicNewsPage` (`this.newsItems.nth(index)`).
    -   Kapsele Selektoren für Elemente *innerhalb* eines News-Artikels relativ zum `root`-Locator (nutze `data-testid`):
        ```typescript
        readonly titleLink = this.root.getByTestId(/news-item-link-\d+/); // Regex für dynamische IDs
        readonly description = this.root.getByTestId(/news-item-desc-\d+/);
        readonly category = this.root.getByTestId(/news-item-category-\d+/);
        readonly source = this.root.getByTestId(/news-item-source-\d+/);
        ```
    -   Implementiere Methoden für Aktionen oder Datenextraktion auf einem einzelnen Artikel:
        -   `getTitle(): Promise<string | null>`: Gibt den Text des Titels zurück.
        -   `getCategory(): Promise<string | null>`: Gibt den Text der Kategorie zurück.
        -   `getDescription(): Promise<string | null>`: Gibt den Beschreibungstext zurück.
        -   `clickTitle(): Promise<void>`: Klickt auf den Titel-Link (öffnet ggf. neuen Tab).
2.  **PublicNewsPage mit Komponenten-Objekten anpassen:**
    -   Passe die `PublicNewsPage`-Klasse (`e2e/pages/PublicNewsPage.ts`) an:
        -   Importiere `NewsItemComponent`.
        -   Entferne Methoden, die jetzt in `NewsItemComponent` gekapselt sind (z.B. `getNewsItemTitle`, `getNewsItemCategory`).
        -   Füge eine Methode hinzu, die ein `NewsItemComponent`-Objekt für einen bestimmten Index zurückgibt:
            ```typescript
            getNewsItem(index: number): NewsItemComponent {
              return new NewsItemComponent(this.newsItems.nth(index));
            }
            ```
        -   (Optional) Füge eine Methode hinzu, die alle `NewsItemComponent`-Objekte als Array zurückgibt:
            ```typescript
            async getAllNewsItems(): Promise<NewsItemComponent[]> {
              const items: NewsItemComponent[] = [];
              const count = await this.newsItems.count();
              for (let i = 0; i < count; i++) {
                items.push(this.getNewsItem(i));
              }
              return items;
            }
            ```
3.  **Fluent Interface in PublicNewsPage implementieren:**
    -   Passe die Aktionsmethoden in `PublicNewsPage` so an, dass sie `this` (oder `Promise<this>`) zurückgeben, um Verkettung zu ermöglichen:
        ```typescript
        async goto(): Promise<this> {
          await this.page.goto('/news/public');
          return this;
        }

        async searchNews(query: string): Promise<this> {
          await this.searchInput.fill(query);
          // Optional: Warte auf Aktualisierung oder füge explizites Warten hinzu
          return this;
        }

        async filterByCategory(categoryLabel: string): Promise<this> {
          await this.categorySelect.selectOption({ label: categoryLabel });
          // Optional: Warte auf Aktualisierung
          return this;
        }

        async waitForNewsToLoad(): Promise<this> {
            await this.newsGrid.waitFor({ state: 'visible' });
            // Oder: await this.loadingIndicator.waitFor({ state: 'hidden' });
            return this;
        }
        ```
4.  **Tests mit erweiterten Page Objects refaktorieren:**
    -   Passe deine `news-feed.spec.ts`-Tests an:
        -   Verwende die `getNewsItem(index)`-Methode, um auf einzelne Artikel zuzugreifen und deren Methoden aufzurufen (z.B. `const firstItemTitle = await publicNewsPage.getNewsItem(0).getTitle();`).
        -   Nutze das Fluent Interface für verkettete Aktionen (z.B. `await publicNewsPage.goto().waitForNewsToLoad().searchNews('Playwright').filterByCategory('Technology');`).
        -   Passe Assertions an, um die Methoden des Komponenten-Objekts zu verwenden (z.B. `expect(await publicNewsPage.getNewsItem(0).getCategory()).toBe('Technology');`).
5.  **Tests ausführen:**
    -   Stelle sicher, dass alle Tests weiterhin erfolgreich sind.

**Zeit:** 30 Minuten

---

> **Tipp:** Komponenten-Objekte (`NewsItemComponent`) machen Tests noch robuster gegenüber Änderungen in der Struktur wiederholender Elemente. Das Fluent Interface (`return this;`) verbessert die Lesbarkeit von Testsequenzen, indem Aktionen aneinandergereiht werden können.
