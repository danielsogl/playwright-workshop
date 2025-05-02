# Übung 3 – Login automatisieren mit Storage State

**Ziel:**
Du implementierst einen effizienten Login-Prozess für die Feed App, indem du den Authentifizierungsstatus (Cookies, Local Storage) nach einem erfolgreichen UI-Login speicherst und für nachfolgende Tests wiederverwendest.

**Aufgaben:**

1. **Projektstruktur vorbereiten:**
   - Erstelle einen Ordner `playwright/.auth` im Projekt-Root
   - Füge `playwright/.auth` zu deiner `.gitignore` hinzu, um keine sensiblen Daten zu committen
   - Erstelle eine Datei `e2e/auth.setup.ts` für den Login-Prozess

2. **Authentication Setup implementieren:**
   - In `auth.setup.ts`:
   ```typescript
   import { test as setup, expect } from '@playwright/test';

   setup('authenticate', async ({ page }) => {
     // Navigiere zur Login-Seite (volle URL verwenden)
     await page.goto('http://localhost:3000/auth/signin');

     // Login durchführen
     await page.getByTestId('input-signin-email').fill('test@example.com');
     await page.getByTestId('input-signin-password').fill('password');
     await page.getByTestId('btn-signin-submit').click();

     // Warte auf erfolgreichen Login
     await expect(page.getByTestId('dropdown-trigger-user')).toBeVisible();
   });
   ```
   **Hinweis:** Ersetze die Credentials mit deinen echten Testdaten!

3. **Playwright Konfiguration anpassen (`playwright.config.ts`):**
   ```typescript
   import { defineConfig, devices } from '@playwright/test';

   export default defineConfig({
     testDir: './e2e',
     use: {
       baseURL: 'http://localhost:3000',
       trace: 'on-first-retry',
     },
     projects: [
       // Setup project für Authentication
       {
         name: 'setup',
         testMatch: /.*\.setup\.ts/
       },
       // Test-Projekte, die den authentifizierten Status verwenden
       {
         name: 'chromium',
         use: {
           ...devices['Desktop Chrome'],
           // Verwende den gespeicherten Auth-Status
           storageState: 'playwright/.auth/user.json',
         },
         dependencies: ['setup']
       },
       {
         name: 'firefox',
         use: {
           ...devices['Desktop Firefox'],
           storageState: 'playwright/.auth/user.json',
         },
         dependencies: ['setup']
       }
     ],
   });
   ```

4. **Authentifizierten Test schreiben:**
   - Erstelle einen neuen Testfall (z.B. in `e2e/private-news.spec.ts`)
   ```typescript
   import { test, expect } from '@playwright/test';

   test('kann private News sehen', async ({ page }) => {
     // Direkt zu geschützter Seite navigieren - kein Login nötig!
     await page.goto('/news/private');
     
     // Prüfe, ob wir eingeloggt sind und Zugriff haben
     await expect(page.getByTestId('title-private-news')).toBeVisible();
     await expect(page.getByTestId('feed-list')).toBeVisible();
   });
   ```

5. **Tests ausführen:**
   - Führe `npx playwright test` aus
   - Der Setup-Project wird zuerst ausgeführt und authentifiziert
   - Alle nachfolgenden Tests starten bereits authentifiziert
   - Im UI-Mode (`npx playwright test --ui`) musst du das Setup-Project explizit aktivieren

**Vorteile dieser Implementierung:**
- Authentifizierung erfolgt nur einmal zu Beginn
- Auth-Status wird für alle Tests wiederverwendet
- Bessere Performance durch weniger Login-Vorgänge
- Sichtbarkeit des Auth-Setups im HTML-Report
- Volle Unterstützung für Traces und Debugging

**Zeit:** 30 Minuten

---

> **Tipp:** Stelle sicher, dass die Feed App läuft (`npm run dev`) und du **gültige Test-Credentials** verwendest. Speichere niemals echte Passwörter im Code - verwende stattdessen Umgebungsvariablen!
