# Übung 15 – Visual Regression Testing

**Ziel:**
Du lernst Visual Regression Testing mit Playwright's Screenshot-Funktionen. Der Fokus liegt auf dem Erkennen von unbeabsichtigten visuellen Änderungen in der Feed App.

> **🧵 Roter Faden**
> **Baut auf (weich):** Übung 9 – optional navigierst du mit der `NewsPage`-POM zu den Screenshot-Zielen.
> **Du gibst weiter:** Visual-Baselines als Regressions-Schutz.
> **Zurückgefallen?** `page.goto()` funktioniert genauso – die POM ist hier nur Komfort.

**Warum Visual Testing?**

- Erkennt CSS/Layout-Probleme, die funktionale Tests übersehen
- Schützt vor unbeabsichtigten Design-Änderungen
- Dokumentiert das erwartete Aussehen der App
- Besonders wichtig für Design Systems und Komponenten

**Aufgaben:**

1. **Basis-Screenshots erstellen:**

   ```typescript
   // e2e/visual-regression.spec.ts
   import { test, expect } from '@playwright/test';

   test.describe('Visual Regression Tests', () => {
     // Screenshots dürfen nicht von Live-Daten abhängen: News-API mit dem
     // Offline-Feed der App mocken (Übung 11)
     test.beforeEach(async ({ page }) => {
       await page.route('**/api/news/public', (route) =>
         route.fulfill({ path: 'app/api/feed.json' }),
       );
     });

     test('Homepage Screenshot', async ({ page }) => {
       await page.goto('/');

       // Web-First auf den erwarteten Zustand warten: Die Navbar zeigt
       // „Loading…", bis die Session geladen ist.
       await expect(
         page.getByRole('button', { name: 'Loading authentication status' }),
       ).toBeHidden();

       // Kein networkidle/Timeout nötig: toHaveScreenshot wartet selbst,
       // bis zwei aufeinanderfolgende Screenshots identisch sind.
       await expect(page).toHaveScreenshot('homepage.png', {
         fullPage: true,
         animations: 'disabled', // Default bei toHaveScreenshot
       });
     });

     test('News Feed Layout', async ({ page }) => {
       await page.goto('/news/public');

       // Web-First: auf den erwarteten Inhalt warten
       await expect(page.getByRole('article').first()).toBeVisible();

       // Screenshot nur vom News-Grid
       const newsGrid = page.getByRole('feed', { name: 'News articles' });
       await expect(newsGrid).toHaveScreenshot('news-grid.png');
     });
   });
   ```

2. **Dark Mode Visual Test:**

   ```typescript
   test('Dark Mode Toggle', async ({ page }) => {
     await page.goto('/');

     // Die App startet im Dark Mode. Der Switch heißt nach der Hydration
     // „Switch to light mode" – der Locator wartet darauf automatisch.
     const toLight = page.getByRole('switch', { name: 'Switch to light mode' });
     await expect(toLight).toBeVisible();

     // Dark Mode Screenshot
     await expect(page).toHaveScreenshot('dark-mode.png');

     // Toggle Light Mode
     await toLight.click();
     await expect(page.locator('html')).toHaveClass(/light/);

     // Light Mode Screenshot
     await expect(page).toHaveScreenshot('light-mode.png');
   });
   ```

3. **Komponenten-Screenshots mit Maskierung:**

   ```typescript
   test('News Card mit dynamischen Inhalten', async ({ page }) => {
     await page.goto('/news/public');

     const firstNewsCard = page.getByRole('article').first();
     await expect(firstNewsCard).toBeVisible();

     // Maskiere dynamische Inhalte (Veröffentlichungsdatum, z.B. „13. September 2026")
     await expect(firstNewsCard).toHaveScreenshot('news-card.png', {
       mask: [firstNewsCard.getByText(/^\d{1,2}\. \S+ \d{4}$/)],
       maskColor: '#FF00FF',
     });
   });
   ```

4. **Responsive Screenshots:**

   ```typescript
   test('Responsive Design Screenshots', async ({ page }) => {
     const viewports = [
       { width: 1920, height: 1080, name: 'desktop' },
       { width: 768, height: 1024, name: 'tablet' },
       { width: 375, height: 667, name: 'mobile' },
     ];

     for (const viewport of viewports) {
       await page.setViewportSize({
         width: viewport.width,
         height: viewport.height,
       });
       await page.goto('/');

       await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
         fullPage: true,
       });
     }
   });
   ```

5. **Cross-Browser Visual Testing:**

   ```typescript
   // Nutze browserName aus dem Test-Context
   test('Cross-Browser Consistency', async ({ page, browserName }) => {
     await page.goto('/news/public');
     await expect(page.getByRole('article').first()).toBeVisible();

     await expect(page).toHaveScreenshot(`news-page-${browserName}.png`, {
       fullPage: true,
     });
   });
   ```

**Screenshots verwalten:**

1. **Erste Ausführung:**

   ```bash
   npx playwright test visual-regression
   ```

   Fehlende Baselines werden automatisch geschrieben (Default-Modus `missing`) – der erste Lauf schlägt dabei fehl, der zweite vergleicht. Ablage: `e2e/visual-regression.spec.ts-snapshots/`

2. **Vergleich bei weiteren Ausführungen:**

   ```bash
   npx playwright test visual-regression
   ```

3. **Screenshots aktualisieren nach gewollten Änderungen:**

   ```bash
   # ohne Wert = changed: nur abweichende Screenshots neu schreiben
   npx playwright test visual-regression --update-snapshots
   # weitere Modi: all, missing, none
   npx playwright test visual-regression --update-snapshots=all
   ```

**Best Practices:**

- ✅ Animationen sind bei `toHaveScreenshot` standardmäßig deaktiviert
- ✅ Maskiere dynamische Inhalte (Datum, Zeit, User-Daten)
- ✅ Mocke wechselnde Daten (z.B. den News-Feed) – auch die Tests aus Aufgabe 3 und 5 brauchen den `beforeEach`-Mock aus Aufgabe 1
- ✅ Warte vor Screenshots mit Web-First-Assertions auf den erwarteten Inhalt (statt `networkidle` oder `waitForTimeout`)
- ✅ Committe Screenshot-Baselines ins Git-Repository
- ✅ Nutze CI-spezifische Toleranzen für kleine Unterschiede
- ✅ Endet der Name auf `.webp` (z.B. `toHaveScreenshot('home.webp')`), speichert Playwright die Baseline als verlustfreies WebP (ab v1.62)
- ❌ Vermeide Screenshots von externen Inhalten (Ads, Social Media Embeds)

**Konfiguration (playwright.config.ts):**

```typescript
use: {
  // Screenshot bei Fehlschlag (unabhängig von toHaveScreenshot)
  screenshot: {
    mode: 'only-on-failure',
    fullPage: true
  },
  video: 'retain-on-failure'
},
expect: {
  // Visual Regression Toleranzen für alle toHaveScreenshot-Aufrufe
  toHaveScreenshot: {
    maxDiffPixelRatio: 0.01,
  },
},
```

**Zeit:** 30 Minuten

---

> **Tipp:** Nutze `npx playwright test --ui` um Screenshots visuell zu vergleichen. Der Diff-Viewer zeigt Pixel-Unterschiede farblich hervorgehoben!
