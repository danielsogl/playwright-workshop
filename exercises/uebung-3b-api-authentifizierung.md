# Übung 3B – API-basierte Authentifizierung

**Ziel:**
Du optimierst den Login-Prozess für die Next.js Feed App, indem du den UI-Login durch eine effizientere API-basierte Authentifizierung ersetzt. Dies macht das Setup schneller und robuster.

**Aufgaben:**

1. **Projektstruktur vorbereiten:**
   - Stelle sicher, dass der `playwright/.auth` Ordner existiert
   - Überprüfe, dass `playwright/.auth` in `.gitignore` ist
   - Erstelle eine Datei `e2e/auth.setup.ts` für den API-basierten Login

2. **Authentication Setup implementieren:**
   ```typescript
   import { test as setup, expect } from '@playwright/test';
   import path from 'path';

   const authFile = path.join(__dirname, '../playwright/.auth/user.json');

   setup('authenticate via API', async ({ request }) => {
     // 1. CSRF Token abrufen (falls nötig)
     const csrfResponse = await request.get('http://localhost:3000/api/auth/csrf');
     const { csrfToken } = await csrfResponse.json();

     // 2. Login Request durchführen
     const loginResponse = await request.post('http://localhost:3000/api/auth/callback/credentials', {
       form: {
         email: process.env.TEST_USER_EMAIL,
         password: process.env.TEST_USER_PASSWORD,
         csrfToken: csrfToken
       },
       // Wichtig: Folge Redirects für NextAuth Session Setup
       maxRedirects: 3
     });

     // 3. Überprüfe erfolgreichen Login
     expect(loginResponse.ok()).toBeTruthy();

     // 4. Speichere den authentifizierten State
     await request.storageState({ path: authFile });
   });
   ```

3. **Environment Setup:**
   - Erstelle eine `.env.test` Datei im Projekt-Root:
   ```bash
   TEST_USER_EMAIL=test@example.com
   TEST_USER_PASSWORD=your_test_password
   ```
   - Füge `.env.test` zu `.gitignore` hinzu
   - Lade die Umgebungsvariablen in der `playwright.config.ts`:
   ```typescript
   import dotenv from 'dotenv';
   dotenv.config({ path: '.env.test' });
   ```

4. **Playwright Konfiguration erweitern (`playwright.config.ts`):**
   ```typescript
   import { defineConfig, devices } from '@playwright/test';

   export default defineConfig({
     testDir: './e2e',
     use: {
       baseURL: 'http://localhost:3000',
       trace: 'on-first-retry',
     },
     projects: [
       // Setup project für API Authentication
       {
         name: 'setup',
         testMatch: /.*\.setup\.ts/
       },
       // Test-Projekte mit Auth State
       {
         name: 'chromium',
         use: {
           ...devices['Desktop Chrome'],
           storageState: 'playwright/.auth/user.json',
         },
         dependencies: ['setup']
       },
       // Optional: Verschiedene Benutzerrollen
       {
         name: 'admin',
         use: {
           ...devices['Desktop Chrome'],
           storageState: 'playwright/.auth/admin.json',
         },
         dependencies: ['setup']
       }
     ],
   });
   ```

5. **Tests mit API Authentication schreiben:**
   ```typescript
   import { test, expect } from '@playwright/test';

   test('authentifizierter API-Zugriff', async ({ request }) => {
     // Der request-Context ist bereits authentifiziert
     const response = await request.get('/api/feeds/private');
     expect(response.ok()).toBeTruthy();
     
     const feeds = await response.json();
     expect(feeds.length).toBeGreaterThan(0);
   });

   test('UI-Test mit API-Auth', async ({ page }) => {
     // Die Page ist bereits authentifiziert
     await page.goto('/news/private');
     await expect(page.getByTestId('feed-list')).toBeVisible();
   });
   ```

6. **(Optional) Multi-Role Testing:**
   ```typescript
   // auth.setup.ts erweitern für multiple Rollen
   setup('authenticate admin via API', async ({ request }) => {
     // ... ähnlich wie oben, aber mit Admin-Credentials
     await request.storageState({ path: 'playwright/.auth/admin.json' });
   });

   // Beispiel für Multi-Role Test
   test('Admin und User Interaktion', async ({ browser }) => {
     // Zwei separate Kontexte mit unterschiedlichen Rollen
     const adminContext = await browser.newContext({ 
       storageState: 'playwright/.auth/admin.json' 
     });
     const userContext = await browser.newContext({ 
       storageState: 'playwright/.auth/user.json' 
     });

     // ... Test-Logik mit beiden Kontexten
     await adminContext.close();
     await userContext.close();
   });
   ```

**Vorteile dieser Implementierung:**
- Schnellere Authentifizierung durch direkten API-Zugriff
- Robuster als UI-basierte Authentifizierung
- Sichere Credential-Verwaltung über Umgebungsvariablen
- Unterstützung für mehrere Benutzerrollen
- Volle Integration mit Playwright's Test Runner

**Zeit:** 30 Minuten

---

> **Tipp:** Verwende die Network-Tab der Browser DevTools um die genauen API-Endpunkte und Payload-Strukturen zu identifizieren. Achte besonders auf die `Set-Cookie` Header in den Responses, da diese für die Session-Verwaltung wichtig sind.
