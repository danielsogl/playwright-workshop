# Übung 5 – API Mocking

**Ziel:**
Du lernst, wie du API-Antworten mockst um Tests unabhängiger, schneller und zuverlässiger zu machen. Der Fokus liegt auf häufigen Szenarien: Success, Error und Loading States.

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
   ```

2. **Erfolgreiche API-Antwort mocken:**

   ```typescript
   import { test, expect } from '@playwright/test';
   import { mockNewsData } from './mocks/news-mocks';

   test('zeigt gemockte News-Daten', async ({ page }) => {
     // Mock API bevor die Seite geladen wird
     await page.route('**/api/news/public', async (route) => {
       await route.fulfill({
         status: 200,
         contentType: 'application/json',
         body: JSON.stringify(mockNewsData.success),
       });
     });

     // Navigiere zur Seite
     await page.goto('/news/public');

     // Prüfe ob Mock-Daten angezeigt werden
     const newsItems = page.getByRole('article');
     await expect(newsItems).toHaveCount(2);

     // Prüfe spezifische Inhalte
     await expect(page.getByText('Test News 1')).toBeVisible();
     await expect(page.getByText('Test News 2')).toBeVisible();
   });
   ```

3. **Fehlerfall testen:**

   ```typescript
   test('zeigt Fehlermeldung bei API-Fehler', async ({ page }) => {
     // Mock API-Fehler
     await page.route('**/api/news/public', async (route) => {
       await route.fulfill({
         status: 500,
         contentType: 'application/json',
         body: JSON.stringify({ error: 'Internal Server Error' }),
       });
     });

     await page.goto('/news/public');

     // Prüfe Fehler-UI
     await expect(page.getByRole('alert')).toBeVisible();
     await expect(page.getByText(/error|fehler/i)).toBeVisible();

     // News-Liste sollte nicht angezeigt werden
     await expect(
       page.getByRole('feed', { name: 'News articles' }),
     ).not.toBeVisible();
   });
   ```

4. **Leere Daten testen:**

   ```typescript
   test('zeigt Empty State bei leeren Daten', async ({ page }) => {
     // Mock leere Antwort
     await page.route('**/api/news/public', async (route) => {
       await route.fulfill({
         status: 200,
         contentType: 'application/json',
         body: JSON.stringify(mockNewsData.empty),
       });
     });

     await page.goto('/news/public');

     // Prüfe Empty State
     await expect(page.getByText(/keine news|no news/i)).toBeVisible();
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

       await route.fulfill({
         status: 200,
         contentType: 'application/json',
         body: JSON.stringify(mockNewsData.success),
       });
     });

     // Starte Navigation (nicht await!)
     const navigationPromise = page.goto('/news/public');

     // Prüfe Loading State
     await expect(
       page.getByRole('status', { name: /loading|lädt/i }),
     ).toBeVisible();

     // Warte auf Navigation
     await navigationPromise;

     // Loading sollte verschwunden sein
     await expect(
       page.getByRole('status', { name: /loading|lädt/i }),
     ).not.toBeVisible();

     // Daten sollten angezeigt werden
     await expect(page.getByRole('article')).toHaveCount(2);
   });
   ```

6. **Dynamisches Mocking (basierend auf Request):**

   ```typescript
   test('mockt basierend auf Suchparametern', async ({ page }) => {
     await page.route('**/api/news/public*', async (route, request) => {
       const url = new URL(request.url());
       const search = url.searchParams.get('search');

       if (search === 'test') {
         // Gebe gefilterte Ergebnisse zurück
         await route.fulfill({
           status: 200,
           body: JSON.stringify({
             items: [mockNewsData.success.items[0]],
           }),
         });
       } else {
         // Gebe alle Daten zurück
         await route.fulfill({
           status: 200,
           body: JSON.stringify(mockNewsData.success),
         });
       }
     });

     await page.goto('/news/public');

     // Initiale Daten
     await expect(page.getByRole('article')).toHaveCount(2);

     // Suche durchführen
     await page.getByRole('textbox', { name: 'Search news' }).fill('test');
     await page.waitForLoadState('networkidle');

     // Gefilterte Daten
     await expect(page.getByRole('article')).toHaveCount(1);
   });
   ```

**Best Practices:**

- ✅ Mocke APIs vor dem Navigieren zur Seite
- ✅ Teste Success, Error und Loading States
- ✅ Verwende realistische Mock-Daten
- ✅ Nutze `waitForLoadState()` nach dynamischen Aktionen
- ❌ Mocke nicht zu viel - manchmal sind echte API-Calls besser

**Zeit:** 25 Minuten

---

> **Tipp:** Mit `npx playwright test --debug` kannst du im Network-Tab sehen, welche Requests gemockt wurden und welche durchgingen!
