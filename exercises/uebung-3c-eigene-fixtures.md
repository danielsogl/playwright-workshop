# Übung 3C – Eigene Fixtures erstellen

**Ziel:**
Du erstellst eigene Playwright-Fixtures für die Next.js Feed App, um wiederkehrende Setup-Schritte zu kapseln und deine Tests lesbarer und wartbarer zu machen. Dabei lernst du die verschiedenen Fixture-Scopes und deren Anwendungsfälle kennen.

**Aufgaben:**

1. **Projektstruktur vorbereiten:**
   - Erstelle einen Ordner `e2e/fixtures`
   - Erstelle die Dateien:
     - `e2e/fixtures/feed-fixtures.ts` (Hauptfixtures)
     - `e2e/fixtures/types.ts` (Typdefinitionen)
     - `e2e/tests/feed-fixtures.spec.ts` (Tests)

2. **Fixture-Typen definieren (`types.ts`):**
   ```typescript
   import { Page, APIRequestContext } from '@playwright/test';
   
   export interface RSSFeed {
     id: string;
     url: string;
     title: string;
     isPrivate: boolean;
   }

   export interface FeedFixtures {
     // Test-scoped fixtures
     feedsPage: Page;        // Basis-Page mit Navigation
     publicFeeds: Page;      // Öffentliche Feeds Seite
     privateFeeds: Page;     // Private Feeds Seite (auth)
     feedApi: APIRequestContext;  // Authentifizierter API Client
     
     // Worker-scoped fixtures (shared between tests)
     testFeed: RSSFeed;     // Test-Feed Daten
   }
   ```

3. **Fixtures implementieren (`feed-fixtures.ts`):**
   ```typescript
   import { test as base } from '@playwright/test';
   import { FeedFixtures } from './types';
   import path from 'path';

   // Erweitere base test mit unseren Fixtures
   export const test = base.extend<FeedFixtures>({
     // Test-scoped Fixtures (default)
     feedsPage: async ({ page }, use) => {
       // Basis-Setup für alle Feed-Seiten
       await page.goto('/');
       await use(page);
     },

     publicFeeds: async ({ feedsPage }, use) => {
       await feedsPage.goto('/news/public');
       await feedsPage.waitForSelector('[data-testid="grid-news-items"]');
       await use(feedsPage);
     },

     privateFeeds: async ({ feedsPage }, use) => {
       await feedsPage.goto('/news/private');
       await feedsPage.waitForSelector('[data-testid="title-private-news"]');
       await use(feedsPage);
     },

     feedApi: async ({ request }, use) => {
       // API Client mit Auth
       const context = await request.newContext({
         baseURL: 'http://localhost:3000',
         storageState: path.join(__dirname, '../../playwright/.auth/user.json'),
       });
       await use(context);
       await context.dispose();
     },

     // Worker-scoped Fixture (shared between tests)
     testFeed: [async ({}, use) => {
       // Erstelle Test-Feed Daten
       const feed = {
         id: `test-${Date.now()}`,
         url: 'https://example.com/feed.xml',
         title: 'Test Feed',
         isPrivate: true
       };
       await use(feed);
     }, { scope: 'worker' }],
   });

   // Re-export expect für einfachere Imports
   export { expect } from '@playwright/test';
   ```

4. **Tests implementieren (`feed-fixtures.spec.ts`):**
   ```typescript
   import { test, expect } from '../fixtures/feed-fixtures';

   test.describe('Feed Management', () => {
     // Basis-Test mit publicFeeds
     test('zeigt öffentliche Feeds an', async ({ publicFeeds }) => {
       await expect(publicFeeds.getByTestId('grid-news-items'))
         .toBeVisible();
     });

     // Test mit privateFeeds
     test('zeigt privates Feed Formular', async ({ privateFeeds }) => {
       await expect(privateFeeds.getByTestId('form-add-feed'))
         .toBeVisible();
     });

     // Test mit feedApi und testFeed
     test('kann Feed über API verwalten', async ({ feedApi, testFeed }) => {
       // Feed erstellen
       const response = await feedApi.post('/api/news/private', {
         data: testFeed
       });
       expect(response.ok()).toBeTruthy();

       // Feed abrufen und prüfen
       const feeds = await feedApi.get('/api/news/private');
       const feedsData = await feeds.json();
       expect(feedsData).toContainEqual(expect.objectContaining({
         id: testFeed.id
       }));

       // Feed löschen
       const deleteResponse = await feedApi.delete(
         `/api/news/private?feedId=${testFeed.id}`
       );
       expect(deleteResponse.ok()).toBeTruthy();
     });

     // Kombinierter Test mit mehreren Fixtures
     test('zeigt neuen Feed in UI an', async ({ 
       privateFeeds, 
       feedApi, 
       testFeed 
     }) => {
       // Feed über API erstellen
       await feedApi.post('/api/news/private', {
         data: testFeed
       });

       // UI aktualisieren
       await privateFeeds.reload();

       // Feed in UI prüfen
       await expect(privateFeeds
         .getByTestId(`feed-item-${testFeed.id}`))
         .toBeVisible();

       // Aufräumen
       await feedApi.delete(`/api/news/private?feedId=${testFeed.id}`);
     });
   });
   ```

**Vorteile dieser Implementierung:**
- Klare Trennung von Fixtures und Tests
- Wiederverwendbare Komponenten
- Test- und Worker-scoped Fixtures für verschiedene Anwendungsfälle
- Automatisches Cleanup nach Tests
- Typsicherheit durch TypeScript
- Effiziente Ressourcennutzung durch Worker-Fixtures

**Zeit:** 40 Minuten

---

> **Tipp:** Nutze `test.describe.configure({ mode: 'serial' })` wenn deine Tests in einer bestimmten Reihenfolge ausgeführt werden müssen. Dies ist besonders nützlich bei Tests, die den gleichen Worker-scoped Feed verwenden.
