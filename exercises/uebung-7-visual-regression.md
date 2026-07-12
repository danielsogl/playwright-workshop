# Übung 7 – Visual Regression Testing

**Ziel:**
Du lernst Visual Regression Testing mit Playwright's Screenshot-Funktionen. Der Fokus liegt auf dem Erkennen von unbeabsichtigten visuellen Änderungen in der Feed App.

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
     test('Homepage Screenshot', async ({ page }) => {
       await page.goto('/');

       // Warte bis Inhalte geladen sind
       await page.waitForLoadState('networkidle');

       // Full-Page Screenshot
       await expect(page).toHaveScreenshot('homepage.png', {
         fullPage: true,
         animations: 'disabled',
       });
     });

     test('News Feed Layout', async ({ page }) => {
       await page.goto('/news/public');

       // Warte auf News-Items
       await page.waitForSelector('[role="article"]');

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

     // Light Mode Screenshot
     await expect(page).toHaveScreenshot('light-mode.png');

     // Toggle Dark Mode
     const themeToggle = page.getByRole('button', { name: /theme/i });
     await themeToggle.click();

     // Dark Mode Screenshot
     await expect(page).toHaveScreenshot('dark-mode.png');
   });
   ```

3. **Komponenten-Screenshots mit Maskierung:**

   ```typescript
   test('News Card mit dynamischen Inhalten', async ({ page }) => {
     await page.goto('/news/public');
     await page.waitForSelector('[role="article"]');

     const firstNewsCard = page.getByRole('article').first();

     // Maskiere dynamische Inhalte (Datum, Zeit)
     await expect(firstNewsCard).toHaveScreenshot('news-card.png', {
       mask: [page.locator('time')],
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
       await page.waitForLoadState('networkidle');

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
     await page.waitForSelector('[role="article"]');

     await expect(page).toHaveScreenshot(`news-page-${browserName}.png`, {
       fullPage: true,
     });
   });
   ```

**Screenshots verwalten:**

1. **Erste Ausführung:**

   ```bash
   npx playwright test visual-regression --update-snapshots
   ```

   Erstellt Baseline-Screenshots in `e2e/visual-regression.spec.ts-snapshots/`

2. **Vergleich bei weiteren Ausführungen:**

   ```bash
   npx playwright test visual-regression
   ```

3. **Screenshots aktualisieren nach gewollten Änderungen:**
   ```bash
   npx playwright test visual-regression --update-snapshots
   ```

**Best Practices:**

- ✅ Deaktiviere Animationen für konsistente Screenshots
- ✅ Maskiere dynamische Inhalte (Datum, Zeit, User-Daten)
- ✅ Verwende `waitForLoadState('networkidle')` vor Screenshots
- ✅ Committe Screenshot-Baselines ins Git-Repository
- ✅ Nutze CI-spezifische Toleranzen für kleine Unterschiede
- ❌ Vermeide Screenshots von externen Inhalten (Ads, Social Media Embeds)

**Konfiguration (playwright.config.ts):**

```typescript
use: {
  // Screenshot-Optionen global setzen
  screenshot: {
    mode: 'only-on-failure',
    fullPage: true
  },
  // Visual Regression Toleranzen
  ignoreHTTPSErrors: true,
  video: 'retain-on-failure'
}
```

**Zeit:** 30 Minuten

---

> **Tipp:** Nutze `npx playwright test --ui` um Screenshots visuell zu vergleichen. Der Diff-Viewer zeigt Pixel-Unterschiede farblich hervorgehoben!
