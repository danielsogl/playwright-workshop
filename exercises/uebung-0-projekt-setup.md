# Übung 0 – Projekt-Setup

**Ziel:**
Du richtest ein Playwright-Testprojekt für die Next.js Feed Demo App ein mit automatischem Server-Start und Umgebungsvariablen.

**Aufgaben:**

1. **Projektverzeichnis vorbereiten:**

   ```bash
   cd playwright-workshop
   npm install
   npx playwright install chromium  # Installiere mindestens einen Browser
   ```

2. **Umgebungsvariablen einrichten:**
   - Erstelle eine `.env.test` Datei:

   ```bash
   # Test-Benutzer für Authentifizierung
   TEST_USER_EMAIL=test@example.com
   TEST_USER_PASSWORD=password123
   ```

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
├── .env.test              # Umgebungsvariablen
├── playwright.config.ts   # Hauptkonfiguration
├── e2e/
│   └── setup.spec.ts     # Erster Test
└── playwright/.auth/     # (wird später für Auth genutzt)
```

**Zeit:** 10 Minuten

---

> **Tipp:** Siehe [Cheat-Sheet: Projekt-Setup](./cheat-sheets/projekt-setup.md)
