# Übung 7 – Authentifizierung optimieren

**Ziel:**
Du lernst verschiedene Ansätze zur Authentifizierung in Playwright-Tests kennen: vom einfachen UI-Login bis zur optimierten API-basierten Authentifizierung. Der gespeicherte Auth-Status wird für alle nachfolgenden Tests wiederverwendet.

> **🧵 Roter Faden**
> **Baut auf:** Übung 3 – die Login-Form, jetzt als wiederverwendbarer Auth-Flow.
> **Du gibst weiter:** den **`storageState`** (`playwright/.auth/user.json`) – schaltet `/news/private` + `/settings` für Tag 2/3 frei – und den **API-Login-Flow** (CSRF → credentials), Basis für die Fixture in Übung 8, die API-Tests in Übung 13 und den Capstone (Übung 17).
> **Zurückgefallen?** Setup-Spec + Config-Auszug liegen in `solutions/e2e/07-authentifizierung.spec.ts`.

**Teil A: UI-basierte Authentifizierung**

**Aufgaben:**

1. **Projektstruktur vorbereiten:**
   - Lege einen Ordner `playwright/.auth` im Projekt-Root an
   - Füge `playwright/.auth` zu deiner `.gitignore` hinzu
   - Erstelle eine Datei `e2e/auth.setup.ts` für den Login-Prozess

   > **Hinweis zur Musterlösung:** Die Lösung bündelt die Setup-Tests aus Kürze im selben Spec (`solutions/e2e/07-authentifizierung.spec.ts`); das `setup`-Projekt in der Config matcht sie über `grep: /authenticate as/`. Weil sie im `chromium`-Projekt zusätzlich mitlaufen, verhindert ein Test-Lock (`{ lock: 'user-auth-state' }`, seit 1.63), dass sie `user.json` überschreiben, während andere Tests die Datei lesen. In deinem eigenen Projekt ist eine separate `*.setup.ts`-Datei mit `testMatch: /.*\.setup\.ts/` die sauberere Variante.

2. **UI-Login implementieren:**

   ```typescript
   import { test as setup, expect } from '@playwright/test';

   // Relativ zum Projekt-Root (dort startet Playwright)
   const authFile = 'playwright/.auth/user.json';

   setup('authenticate via UI', async ({ page }) => {
     // Navigiere zur Login-Seite. Auth.js setzt das CSRF-Cookie beim Laden
     // der Session – wer vorher absendet, bekommt auf kaltem Dev-Server MissingCSRF.
     const sessionLoaded = page.waitForResponse('**/api/auth/session');
     await page.goto('/auth/signin');
     await sessionLoaded;

     // Fülle das Login-Formular aus
     await page
       .getByLabel('Email')
       .fill(process.env.TEST_USER_EMAIL || 'test@example.com');
     await page
       .getByLabel('Password')
       .fill(process.env.TEST_USER_PASSWORD || 'password');

     // Klicke auf den Login-Button
     await page.getByRole('button', { name: 'Submit sign in form' }).click();

     // Warte auf erfolgreiche Navigation
     await page.waitForURL('/');

     // Optional: Prüfe ob Login erfolgreich war
     await expect(page.getByRole('button', { name: 'User profile actions menu' })).toBeVisible();

     // Speichere den authentifizierten State
     await page.context().storageState({ path: authFile });
   });
   ```

**Teil B: API-basierte Authentifizierung (Optimierung)**

3. **Optimiere den Login mit API-Calls:**
   - Ersetze den UI-Login durch direkten API-Zugriff für schnellere Tests:

   ```typescript
   setup('authenticate via API', async ({ request }) => {
     // CSRF Token abrufen
     const csrfResponse = await request.get('/api/auth/csrf');
     const { csrfToken } = await csrfResponse.json();

     // Login Request
     const loginResponse = await request.post(
       '/api/auth/callback/credentials',
       {
         form: {
           email: process.env.TEST_USER_EMAIL || 'test@example.com',
           password: process.env.TEST_USER_PASSWORD || 'password',
           csrfToken: csrfToken,
         },
         maxRedirects: 3,
       },
     );

     // Überprüfe erfolgreichen Login
     await expect(loginResponse).toBeOK();

     // Speichere den authentifizierten State
     await request.storageState({ path: authFile });
   });
   ```

4. **Playwright-Konfiguration anpassen:**

   ```typescript
   // playwright.config.ts
   export default defineConfig({
     projects: [
       // Setup-Projekt für Authentifizierung
       {
         name: 'setup',
         testMatch: /.*\.setup\.ts/,
       },
       // Browser-Projekte mit Auth-Status
       {
         name: 'chromium',
         use: {
           ...devices['Desktop Chrome'],
           storageState: 'playwright/.auth/user.json',
         },
         dependencies: ['setup'],
       },
       // ... weitere Browser
     ],
   });
   ```

   > **UI Mode:** Der UI Mode (`npx playwright test --ui`) startet das `setup`-Projekt nicht automatisch. Führe es dort einmal manuell aus, sonst fehlt `playwright/.auth/user.json`.

5. **Test mit Authentifizierung schreiben:**

   ```typescript
   // e2e/private-news.spec.ts
   import { test, expect } from '@playwright/test';

   test('kann auf private News zugreifen', async ({ page }) => {
     await page.goto('/news/private');

     // Sollte direkt zugreifen können ohne Login
     await expect(
       page.getByRole('heading', { name: 'Your Private News Feeds' }),
     ).toBeVisible();
     await expect(
       page.getByRole('list', { name: 'Your RSS feeds' }),
     ).toBeVisible();
   });
   ```

6. **Environment-Variablen einrichten:**
   - Erstelle eine `.env` Datei:
   ```
   TEST_USER_EMAIL=test@example.com
   TEST_USER_PASSWORD=password
   ```

   - Lade sie in der Playwright-Config:
   ```typescript
   import dotenv from 'dotenv';
   dotenv.config({ path: '.env' });
   ```

**Bonus: Multi-Role Testing**

7. **(Optional) Mehrere Benutzerrollen testen:**

   ```typescript
   // Erstelle separate Auth-Files für verschiedene Rollen
   setup('admin login', async ({ request }) => {
     // ... Login als Admin
     await request.storageState({ path: 'playwright/.auth/admin.json' });
   });

   setup('user login', async ({ request }) => {
     // ... Login als normaler User
     await request.storageState({ path: 'playwright/.auth/user.json' });
   });
   ```

**Zeit:** 35 Minuten

**Vorteile dieser Implementierung:**

- UI-Login als Fallback und für End-to-End-Verifizierung
- API-Login für schnelle Test-Ausführung
- Wiederverwendbare Auth-States für alle Tests
- Sichere Credential-Verwaltung über Umgebungsvariablen
- Unterstützung für Multi-Role-Testing

> **Geteilter Account?** Ändern einzelne Tests Serverzustand desselben Test-Users (z. B. Settings), markiere sie mit einem Test-Lock (seit 1.63): `test('Profil umbenennen', { lock: 'user-settings' }, async ({ page }) => { … })`. Tests mit gleichem Lock-Namen laufen nie gleichzeitig, auch nicht über Dateien, Worker und Projekte hinweg.

---

> **Tipp:** Starte mit dem UI-Login um sicherzustellen, dass alles funktioniert. Optimiere dann mit dem API-Ansatz für schnellere Tests. Verwende `npx playwright test --project=setup` um nur das Auth-Setup auszuführen.
