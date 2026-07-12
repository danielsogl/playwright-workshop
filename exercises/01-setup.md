# Übung 1 – Projekt-Setup

**Ziel:**
Du richtest ein Playwright-Testprojekt für die Next.js Feed Demo App ein mit automatischem Server-Start und Umgebungsvariablen.

> **🧵 Roter Faden**
> **Das baust du:** Über die drei Tage entsteht Schritt für Schritt eine professionelle E2E-Test-Suite für genau diese **Feeds**-App – jede Übung fügt ein Stück hinzu oder verbessert Bestehendes (Login → Public-News/Suche → Private-Feeds → Settings → Logout). Ein Projekt, ein wachsender `e2e/`-Ordner, ein `e2e/pages/`-Ordner.
> **Du gibst weiter:** ein lauffähiges Setup (`.env`, `webServer`), auf dem alle folgenden Übungen aufbauen.

**Aufgaben:**

1. **Projektverzeichnis vorbereiten:**

   ```bash
   cd playwright-workshop
   npm install
   npx playwright install  # Chromium, Firefox und WebKit
   ```

2. **Umgebungsvariablen einrichten:**
   - Kopiere die Beispiel-Datei nach `.env`:

   ```bash
   cp .env.example .env
   ```

   Sie enthält bereits Test-Zugangsdaten (`TEST_USER_EMAIL` / `TEST_USER_PASSWORD`), den Offline-Modus für die News-Feeds (`RSS_OFFLINE_MODE=true`) und ein `AUTH_SECRET`.

3. **Playwright-Konfiguration mit webServer anpassen:**
   - Öffne `playwright.config.ts` und aktiviere den webServer:

   ```typescript
   webServer: {
     command: 'npm run dev',
     url: 'http://localhost:3000',
     reuseExistingServer: !process.env.CI,
     timeout: 120 * 1000,
   },
   ```

4. **Ersten Smoke-Test erstellen:**
   - Erstelle `e2e/setup.spec.ts`:

   ```typescript
   import { test, expect } from '@playwright/test';

   test('App ist erreichbar', async ({ page }) => {
     await page.goto('/');

     // Prüfe ob die App lädt
     await expect(page).toHaveTitle(/Playwright Demo/);

     // Prüfe ob Hauptnavigation vorhanden ist
     await expect(page.getByRole('navigation').first()).toBeVisible();
   });
   ```

5. **Test ausführen und verifizieren:**

   ```bash
   npx playwright test setup.spec.ts
   # Server startet automatisch!
   ```

6. **Playwright UI kennenlernen:**
   ```bash
   npx playwright test --ui
   # Erkunde die interaktive Test-Oberfläche
   ```

**Projekt-Struktur nach Setup:**

```
playwright-workshop/
├── .env                   # Umgebungsvariablen
├── playwright.config.ts   # Hauptkonfiguration
├── e2e/
│   └── setup.spec.ts     # Erster Test
└── playwright/.auth/     # (wird später für Auth genutzt)
```

**Zeit:** 10 Minuten
