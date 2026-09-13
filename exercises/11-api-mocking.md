# Übung 11 – API Mocking

**Ziel:**
Du lernst, wie du API-Antworten mockst um Tests unabhängiger, schneller und zuverlässiger zu machen. Der Fokus liegt auf häufigen Szenarien: Success, Error und Loading States.

> **🧵 Roter Faden**
> **Baut auf:** Übung 5/9 – derselbe Suchtest auf `/news/public`, jetzt mit deterministischen Mock-Daten statt Live-Feed.
> **Du gibst weiter:** die Mock-Datei `e2e/mocks/news-mocks.ts` – wird in Übung 12 direkt importiert.
> **Zurückgefallen?** Mock-Daten + Routen stehen im Handout; `solutions/e2e/mocks/news-mocks.ts` ist die Referenz.

**Warum API Mocking?**

- Tests sind unabhängig vom Backend
- Schnellere Test-Ausführung
- Testen von Edge Cases (Fehler, leere Daten)
- Konsistente Test-Daten

**Aufgaben:**

1. **Mock-Daten vorbereiten:**

   ```typescript
   // e2e/mocks/news-mocks.ts
   export const mockNewsData = {
     success: {
       items: [
         {
           title: 'Test Technology News',
           link: 'https://example.com/tech-news',
           description: 'Dies ist ein Test-Artikel über Technologie',
           pubDate: 'Mon, 01 Jan 2024 10:00:00 GMT',
           category: 'Technology',
           source: 'Test Source',
           snippet: 'Ein kurzer Auszug des Artikels',
           isoDate: '2024-01-01T10:00:00.000Z',
         },
         {
           title: 'Test Business News',
           link: 'https://example.com/business-news',
           description: 'Ein wichtiger Business-Artikel für Tests',
           pubDate: 'Tue, 02 Jan 2024 14:30:00 GMT',
           category: 'Business',
           source: 'Test Source',
           snippet: 'Business News Zusammenfassung',
           isoDate: '2024-01-02T14:30:00.000Z',
         },
       ],
     },
     empty: {
       items: [],
     },
   };

   // Ein-Artikel-Feed, den Übung 12 direkt importiert
   export const mockSearchFeed = {
     items: [
       {
         title: 'Gemockte News',
         description: 'Beschreibung der gemockten News',
         link: 'https://example.com/mock-1',
         category: 'Technology',
         source: 'Mock Source',
         pubDate: '2026-01-01T10:00:00.000Z',
         isoDate: '2026-01-01T10:00:00.000Z',
       },
     ],
   };
   ```

2. **Erfolgreiche API-Antwort mocken:**

   ```typescript
   import { test, expect } from '@playwright/test';
   import { mockNewsData } from './mocks/news-mocks';

   test('zeigt gemockte News-Daten', async ({ page }) => {
     // Mock API bevor die Seite geladen wird
     // `json` serialisiert den Body und setzt den Content-Type automatisch
     await page.route('**/api/news/public', async (route) => {
       await route.fulfill({ json: mockNewsData.success });
     });

     // Navigiere zur Seite
     await page.goto('/news/public');

     // Prüfe ob Mock-Daten angezeigt werden
     const newsItems = page.getByRole('article');
     await expect(newsItems).toHaveCount(2);

     // Prüfe spezifische Inhalte
     await expect(page.getByText('Test Technology News')).toBeVisible();
     await expect(page.getByText('Test Business News')).toBeVisible();
   });
   ```

3. **Fehlerfall testen:**

   ```typescript
   test('zeigt Fehlermeldung bei API-Fehler', async ({ page }) => {
     // Mock API-Fehler
     await page.route('**/api/news/public', async (route) => {
       await route.fulfill({
         status: 500,
         json: { error: 'Internal Server Error' },
       });
     });

     await page.goto('/news/public');

     // Prüfe Fehler-UI
     await expect(
       page.getByRole('alert').filter({ hasText: 'Failed to load RSS feeds' }),
     ).toBeVisible();

     // News-Liste sollte nicht angezeigt werden
     await expect(
       page.getByRole('feed', { name: 'News articles' }),
     ).toBeHidden();
   });
   ```

4. **Leere Daten testen:**

   ```typescript
   test('zeigt Empty State bei leeren Daten', async ({ page }) => {
     // Mock leere Antwort
     await page.route('**/api/news/public', async (route) => {
       await route.fulfill({ json: mockNewsData.empty });
     });

     await page.goto('/news/public');

     // Prüfe Empty State (die App zeigt nur den Zähler)
     await expect(page.getByText('0 articles found')).toBeVisible();
     await expect(page.getByRole('article')).toHaveCount(0);
   });
   ```

5. **Loading State testen (mit Delay):**

   ```typescript
   test('zeigt Loading State während API-Call', async ({ page }) => {
     // Mock mit Verzögerung
     await page.route('**/api/news/public', async (route) => {
       // 2 Sekunden warten
       await new Promise((resolve) => setTimeout(resolve, 2000));
       await route.fulfill({ json: mockNewsData.success });
     });

     // goto() wartet auf das load-Event, nicht auf den API-Call
     await page.goto('/news/public');

     // Prüfe Loading State
     const loading = page.getByRole('status', { name: 'Loading news feed' });
     await expect(loading).toBeVisible();

     // Loading sollte verschwinden
     await expect(loading).toBeHidden();

     // Daten sollten angezeigt werden
     await expect(page.getByRole('article')).toHaveCount(2);
   });
   ```

6. **Dynamisches Mocking (Verhalten zur Laufzeit umschalten):**

   ```typescript
   test('mockt Rate Limiting nach dem ersten Laden', async ({ page }) => {
     let rateLimited = false;

     await page.route('**/api/news/public', async (route) => {
       if (route.request().method() !== 'GET') {
         // Alles andere an weitere Handler oder ans Netzwerk weitergeben
         await route.fallback();
       } else if (rateLimited) {
         await route.fulfill({ status: 429, json: { error: 'Too Many Requests' } });
       } else {
         await route.fulfill({ json: mockNewsData.success });
       }
     });

     await page.goto('/news/public');

     // Initiale Daten
     await expect(page.getByRole('article')).toHaveCount(2);

     // Ab jetzt antwortet die API mit 429
     rateLimited = true;
     await page.reload();

     await expect(
       page.getByRole('alert').filter({ hasText: 'Failed to load RSS feeds' }),
     ).toBeVisible();
   });
   ```

   > **Hinweis:** Die Suche auf `/news/public` filtert clientseitig – sie löst **keinen** neuen API-Call aus. Mit gemockten Daten kannst du sie trotzdem deterministisch testen: `getByRole('textbox', { name: 'Search news articles' })` befüllen und `toHaveCount` prüfen.

**Best Practices:**

- ✅ Mocke APIs vor dem Navigieren zur Seite
- ✅ Teste Success, Error und Loading States
- ✅ Verwende realistische Mock-Daten
- ✅ `route.fulfill({ json })` statt `body: JSON.stringify(...)` + `contentType`
- ✅ Route-Handler `async` schreiben und `route.fulfill/continue/fallback/abort` immer `await`en
- ✅ Web-first Assertions (`toHaveCount`, `toBeVisible`) statt `waitForLoadState('networkidle')`
- ❌ Mocke nicht zu viel - manchmal sind echte API-Calls besser

**Zeit:** 25 Minuten

---

> **Tipp:** Mit `npx playwright test --debug` kannst du im Network-Tab sehen, welche Requests gemockt wurden und welche durchgingen!
