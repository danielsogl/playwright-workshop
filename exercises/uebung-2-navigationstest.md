# Übung 2 – News Feed Suche testen

**Ziel:**
Du testest die Suchfunktion auf der öffentlichen News-Feed-Seite. Dabei lernst du Test-Organisation mit `beforeEach`, Formular-Interaktionen und das Arbeiten mit dynamischen Inhalten.

**Aufgaben:**

1. **Test-Suite mit Setup erstellen:**

   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('News Feed Suche', () => {
     // Vor jedem Test zur News-Seite navigieren
     test.beforeEach(async ({ page }) => {
       await page.goto('/news/public');

       // Warte bis die News geladen sind
       await expect(
         page.getByRole('feed', { name: 'News articles' }),
       ).toBeVisible();
     });

     // Tests kommen hier...
   });
   ```

2. **Initiale Anzeige testen:**

   ```typescript
   test('zeigt alle News-Artikel initial an', async ({ page }) => {
     // Finde die News-Liste
     const newsList = page.getByRole('feed', { name: 'News articles' });
     const newsItems = newsList.getByRole('article');

     // Der Feed zeigt initial mehrere Artikel an
     await expect(newsItems.first()).toBeVisible();
     expect(await newsItems.count()).toBeGreaterThan(0);
   });
   ```

3. **Suchfunktion implementieren:**

   ```typescript
   test('kann nach News suchen', async ({ page }) => {
     // Finde das Suchfeld und die Artikel
     const searchInput = page.getByRole('textbox', { name: 'Search news' });
     const newsItems = page.getByRole('article');
     await expect(searchInput).toBeVisible();

     // Anzahl der initial angezeigten Artikel merken
     const initialCount = await newsItems.count();

     // Suche nach einem Begriff der keine Ergebnisse liefert
     await searchInput.fill('XYZ123');
     await searchInput.press('Enter'); // Oder warte auf auto-search

     // Prüfe dass keine Artikel angezeigt werden
     await expect(newsItems).toHaveCount(0);

     // Leere Suche und prüfe Reset
     await searchInput.clear();
     await expect(newsItems).toHaveCount(initialCount);

     // Suche nach existierendem Begriff
     await searchInput.fill('Technology');

     // Warte bis die Filterung angewendet wurde
     await expect(newsItems.first()).toContainText(/technology/i);

     // Prüfe dass weniger Artikel angezeigt werden
     const count = await newsItems.count();
     expect(count).toBeLessThan(initialCount);
     expect(count).toBeGreaterThan(0);
   });
   ```

4. **Erweiterte Suche mit Assertions:**

   ```typescript
   test('zeigt Suchergebnisse korrekt an', async ({ page }) => {
     const searchInput = page.getByRole('textbox', { name: 'Search news' });
     const newsList = page.getByRole('feed', { name: 'News articles' });

     // Suche nach spezifischem Artikel (genau ein Treffer im Feed)
     await searchInput.fill('Cybersecurity');

     // Warte bis genau 1 Ergebnis angezeigt wird
     await expect(newsList.getByRole('article')).toHaveCount(1);

     // Prüfe den Inhalt des Ergebnisses
     const result = newsList.getByRole('article').first();
     await expect(result).toContainText('Cybersecurity');

     // Optional: Prüfe weitere Details
     const headline = result.getByRole('heading');
     await expect(headline).toBeVisible();
   });
   ```

5. **Trace für Debugging aktivieren:**
   - In `playwright.config.ts`:

   ```typescript
   use: {
     trace: 'retain-on-failure', // Trace nur bei Fehlern
     screenshot: 'only-on-failure',
   },
   ```

6. **Tests ausführen und Trace analysieren:**

   ```bash
   # Tests ausführen
   npx playwright test navigationstest.spec.ts

   # Bei Fehler: Trace öffnen
   npx playwright show-report
   ```

**Was du lernst:**

- Test-Organisation mit `describe` und `beforeEach`
- Formular-Interaktionen (fill, clear, press)
- Dynamische Assertions mit count()
- Arbeiten mit Listen von Elementen
- Trace-Viewer für Debugging

**Zeit:** 20 Minuten

---

> **Tipp:** Der Trace-Viewer zeigt jeden Schritt deines Tests mit Screenshots, Netzwerk-Aktivität und Console-Logs. Perfekt um zu verstehen, was während des Tests passiert!
