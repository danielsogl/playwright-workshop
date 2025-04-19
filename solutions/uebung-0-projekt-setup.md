# Lösung: Übung 0 – Projekt-Setup

## 1. Abhängigkeiten installieren
```bash
npm install
npx playwright install
```

## 2. Anwendung starten
```bash
npm run dev
# App läuft auf http://localhost:3000
```

## 3. Playwright initialisieren
```bash
npx playwright test --init
# Wähle TypeScript, Testordner: e2e
```

## 4. Beispieltest erstellen
Lege die Datei `e2e/todo/home.spec.ts` an (Domain-Ordner verwenden):

```typescript
import { test, expect } from '@playwright/test';

test('Startseite zeigt Überschrift', async ({ page }) => {
  await page.goto('/'); // baseURL wird empfohlen
  await expect(page.getByRole('heading', { name: /welcome to the playwright demo app/i })).toBeVisible();
});
```

**Hinweis:** Die `baseURL` sollte in `playwright.config.ts` gesetzt sein:
```typescript
use: {
  baseURL: 'http://localhost:3000',
  trace: 'on-first-retry',
  video: 'on',
  screenshot: 'only-on-failure',
},
```

## 5. Test ausführen
```bash
npx playwright test
```

## 6. Projektstruktur prüfen
- `playwright.config.ts`: zentrale Konfiguration
- `e2e/<domain>/`: Testordner nach Feature/Domain
- `e2e/utils/`: Hilfsfunktionen und Page Objects

---
**Best Practices:**
- Nutze das Page Object Model für komplexere Tests (siehe e2e/utils/).
- Schreibe Tests unabhängig und nutzerzentriert.
- Nutze semantische Selektoren (`getByRole`, `getByText`) für stabile Tests.
