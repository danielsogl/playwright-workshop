# Übung 2 – Filtertest im News Feed

**Ziel:**
Du testest die Filter- und Suchfunktionen auf der öffentlichen News-Feed-Seite der Next.js Feed Demo App.

**Aufgaben:**

1.  Erstelle einen neuen Testfall in deiner `navigation.spec.ts` oder einer neuen Datei (z.B. `news-feed.spec.ts`).
2.  **Navigiere zur Public News Seite:**
    -   Öffne die Seite `/news/public`.
    -   Warte darauf, dass die News-Items geladen sind (z.B. warte auf die Sichtbarkeit eines Elements mit `page.getByRole('list')` oder `page.getByRole('region', { name: /news/i })`, je nach semantischer Auszeichnung).
3.  **Teste die Suchfunktion:**
    -   Finde das Suchfeld (z.B. mit `page.getByRole('textbox', { name: /search/i })` oder `page.getByPlaceholder('Search news...')`).
    -   Gib einen Suchbegriff ein, der voraussichtlich einige, aber nicht alle Artikel trifft (z.B. "Tech", "AI", "Next.js" - je nach Inhalt der Feeds).
    -   Warte kurz oder prüfe, ob sich die Anzahl der angezeigten Artikel (z.B. `page.getByRole('article')` oder `page.getByRole('listitem')`) reduziert hat.
    -   Prüfe (stichprobenartig), ob die angezeigten Artikel den Suchbegriff im Titel oder in der Beschreibung enthalten (z.B. mit `expect(locator).toContainText(...)`).
    -   Leere das Suchfeld (`locator.fill('')`).
    -   Prüfe, ob wieder mehr (oder alle ursprünglichen) Artikel angezeigt werden.
4.  **Teste die Kategorie-Filterung:**
    -   Finde das Kategorie-Dropdown (z.B. mit `page.getByRole('combobox', { name: /category/i })`).
    -   Wähle eine spezifische Kategorie aus (z.B. 'Technology' oder eine andere verfügbare Kategorie - siehe `config/rss-sources.ts`). Verwende `locator.selectOption({ label: '...' })` oder `locator.selectOption('Technology')`.
    -   Prüfe, ob nur Artikel der ausgewählten Kategorie angezeigt werden. Du kannst dies tun, indem du den Kategorie-Text (z.B. mit `locator.getByText('Technology')`) in den angezeigten Artikeln überprüfst.
    -   Wähle wieder "All Categories" aus (`locator.selectOption({ label: 'All Categories' })`).
    -   Prüfe, ob wieder Artikel aus verschiedenen Kategorien angezeigt werden.
5.  **Aktiviere die Trace-Aufzeichnung in `playwright.config.ts` (z.B. `trace: 'on'`) und führe den Test erneut aus.**
    -   Stelle sicher, dass `trace: 'on'` oder `trace: 'retain-on-failure'` in der `use`-Sektion deiner `playwright.config.ts` gesetzt ist.
6.  **Öffne den HTML-Report (`npx playwright show-report`) und analysiere den Trace für den Testlauf.**

**Zeit:** 25 Minuten

---

> **Tipp:** Verwende `page.goto()`, `page.getByRole()`, `page.getByLabel()`, `page.getByPlaceholder()`, `locator.fill()`, `locator.selectOption()`, `expect(locator).toContainText()` und `expect(locator).toHaveCount()`. Nutze keine TestIds oder CSS-Selektoren, sondern semantische, benutzerorientierte Selektoren. Manchmal ist ein kurzes `page.waitForTimeout()` nach dem Filtern hilfreich, wenn die UI nicht sofort aktualisiert wird, obwohl Playwright normalerweise darauf wartet.
