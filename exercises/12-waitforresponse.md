# Übung 12 – API Mocking mit waitForResponse

**Ziel:**
Du kombinierst Request-Interception (`page.route`) mit `page.waitForResponse`, um gezielt die empfangenen Netzwerkdaten zu prüfen – und abzugleichen, dass sie korrekt im UI dargestellt werden.

> **🧵 Roter Faden**
> **Baut auf:** Übung 11 – du importierst die Mock-Daten aus `e2e/mocks/news-mocks.ts` statt sie inline zu definieren (siehe Snippet-Variante unten).
> **Du gibst weiter:** das Muster „Response abfangen + gegen UI abgleichen".
> **Zurückgefallen?** Fehlt Übung 11, definiere den Mock inline – das Handout zeigt beide Wege.

**Aufgaben:**

1. **Antwort mocken:** Fange `**/api/news/public` mit `page.route` ab und liefere einen eigenen Feed zurück.
2. **Response abfangen:** Registriere `page.waitForResponse('**/api/news/public')` **vor** der Navigation.
3. **Navigieren** und die abgefangene Response prüfen (Status + JSON).
4. **UI abgleichen:** Prüfe, dass die gemockten Artikel tatsächlich angezeigt werden.

   ```typescript
   import { test, expect } from '@playwright/test';
   // Reuse aus Übung 11: die Mock-Daten kommen aus der geteilten Datei.
   import { mockSearchFeed as mockFeed } from './mocks/news-mocks';

   // Fallback ohne Übung 11 – Mock inline definieren:
   // const mockFeed = {
   //   items: [
   //     {
   //       title: 'Gemockte News',
   //       description: 'Beschreibung der gemockten News',
   //       link: 'https://example.com/mock-1',
   //       category: 'Technology',
   //       source: 'Mock Source',
   //       pubDate: '2026-01-01T10:00:00.000Z',
   //       isoDate: '2026-01-01T10:00:00.000Z',
   //     },
   //   ],
   // };

   test('empfängt und verarbeitet gemockte Response', async ({ page }) => {
     // 1. API mocken
     await page.route('**/api/news/public', async (route) => {
       await route.fulfill({
         status: 200,
         contentType: 'application/json',
         body: JSON.stringify(mockFeed),
       });
     });

     // 2. Response abfangen (vor der Navigation!)
     const responsePromise = page.waitForResponse('**/api/news/public');

     // 3. Navigieren
     await page.goto('/news/public');

     // 4. Netzwerkantwort prüfen
     const response = await responsePromise;
     expect(response.status()).toBe(200);
     const data = await response.json();
     expect(data.items).toHaveLength(1);
     expect(data.items[0].title).toBe('Gemockte News');

     // 5. Abgleich mit dem UI
     const articles = page.getByRole('article');
     await expect(articles).toHaveCount(1);
     await expect(articles.first()).toContainText('Gemockte News');
   });
   ```

**Was du lernst:**

- `page.route` + `route.fulfill` zum Mocken
- `page.waitForResponse` zum gezielten Abfangen einer Antwort
- Response-Daten (`response.json()`) gegen die UI-Darstellung abgleichen

**Zeit:** 20 Minuten
