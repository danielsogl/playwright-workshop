# Übung 2 – Filtertest im News Feed

**Ziel:**
Du testest die Filter- und Suchfunktionen auf der öffentlichen News-Feed-Seite der Next.js Feed Demo App.

**Aufgaben:**

1.  Erstelle einen neuen Testfall in einer Datei `e2e/nav.spec.ts` oder ähnlich.
2.  **Erstelle eine Test-Suite mit beforeEach:**
    -   Verwende `test.describe('News Feed Filter & Suche', () => {...});`
    -   Füge einen `test.beforeEach`-Hook hinzu, der zur Seite `/news/public` navigiert.
3.  **Teste die initiale Anzeige:**
    -   Erstelle einen Test `'zeigt News-Items an'` 
    -   Wähle die News-Liste mit `page.getByRole('list', { name: 'News articles' })`
    -   Prüfe, ob die Liste sichtbar ist und genau 65 Listenelemente enthält
4.  **Teste die Suchfunktion:**
    -   Erstelle einen Test `'filtert News per Suchfeld'`
    -   Finde das Suchfeld mit `page.getByRole('textbox', { name: 'Search news' })`
    -   Gib den Suchbegriff "Foo" ein und prüfe, dass keine Artikel angezeigt werden
    -   Gib den Suchbegriff "Revelo" ein und prüfe, dass genau 1 Artikel angezeigt wird
    -   Leere das Suchfeld und prüfe, dass wieder alle 65 Artikel angezeigt werden
5.  **Teste die Kategorie-Filterung:**
    -   Erstelle einen Test `'filtert News per Kategorie'`
    -   Finde das Kategorie-Dropdown mit `page.getByLabel('Filter news by category')`
    -   Wähle die Kategorie "Technology" und prüfe, dass genau 40 Artikel angezeigt werden
    -   Prüfe, dass der erste angezeigte Artikel den Text "Technology" enthält
    -   Wähle wieder "All Categories" aus und prüfe, dass wieder alle 65 Artikel angezeigt werden
6.  **Aktiviere die Trace-Aufzeichnung in `playwright.config.ts` (z.B. `trace: 'on'`) und führe den Test aus.**
    -   Stelle sicher, dass `trace: 'on'` oder `trace: 'retain-on-failure'` in der `use`-Sektion deiner `playwright.config.ts` gesetzt ist.
7.  **Öffne den HTML-Report (`npx playwright show-report`) und analysiere den Trace für den Testlauf.**

**Zeit:** 25 Minuten

---

> **Tipp:** Nutze die folgenden Playwright-Funktionen:
> - `page.goto()` für die Navigation
> - `page.getByRole()` und `page.getByLabel()` für semantische Selektoren
> - `locator.fill()` für das Ausfüllen von Textfeldern
> - `locator.selectOption()` für die Auswahl in Dropdowns
> - `expect(locator).toBeVisible()` zum Prüfen der Sichtbarkeit
> - `expect(locator).toHaveCount()` zum Prüfen der Anzahl von Elementen
> - `expect(locator).toContainText()` zum Prüfen des Textinhalts

```typescript
// Beispielstruktur deines Tests
import { test, expect } from '@playwright/test';

test.describe('News Feed Filter & Suche', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/news/public');
  });

  test('zeigt News-Items an', async ({ page }) => {
    // Code hier
  });

  test('filtert News per Suchfeld', async ({ page }) => {
    // Code hier
  });

  test('filtert News per Kategorie', async ({ page }) => {
    // Code hier
  });
});
```
