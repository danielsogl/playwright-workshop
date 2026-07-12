# Übung 16 – Mobile Testing

**Ziel:**
Du lernst, wie du mit Playwright mobile Geräte emulierst und responsive Designs testest. Der Fokus liegt auf praktischen Tests für die Next.js Feed App.

> **🧵 Roter Faden**
> **Baut auf (weich):** Übung 9 – optionaler `NewsPage`-POM-Reuse zum Navigieren von `/` und dem Feed.
> **Zurückgefallen?** `page.goto()` reicht; die POM ist hier nur Komfort.

**Aufgaben:**

1. **Mobile Projekte in der Konfiguration definieren:**
   - Öffne `playwright.config.ts`
   - Aktiviere die auskommentierten Mobile-Projekte:

   ```typescript
   projects: [
     // Desktop Browser
     {
       name: 'chromium',
       use: { ...devices['Desktop Chrome'] },
     },
     // Mobile Devices
     {
       name: 'Mobile Chrome',
       use: { ...devices['Pixel 5'] },
     },
     {
       name: 'Mobile Safari',
       use: { ...devices['iPhone 13'] },
     },
   ],
   ```

2. **Responsive Navigation testen:**
   - Erstelle `e2e/responsive.spec.ts`:

   ```typescript
   import { test, expect, devices } from '@playwright/test';

   test.describe('Responsive Navigation', () => {
     test('Desktop: zeigt normale Navigation', async ({ page }) => {
       await page.goto('/');

       // Desktop Navigation sollte sichtbar sein
       const desktopNav = page
         .getByRole('navigation')
         .locator('.hidden.lg\\:flex');
       await expect(desktopNav).toBeVisible();

       // Mobile Menu Button sollte nicht sichtbar sein
       const mobileMenuButton = page.getByRole('button', { name: /menu/i });
       await expect(mobileMenuButton).not.toBeVisible();
     });

     test('Mobile: zeigt Hamburger Menu', async ({ page, isMobile }) => {
       // Dieser Test läuft nur auf mobilen Geräten
       if (!isMobile) {
         test.skip();
       }

       await page.goto('/');

       // Mobile Menu Button sollte sichtbar sein
       const mobileMenuButton = page.getByRole('button', { name: /menu/i });
       await expect(mobileMenuButton).toBeVisible();

       // Desktop Navigation sollte nicht sichtbar sein
       const desktopNav = page
         .getByRole('navigation')
         .locator('.hidden.lg\\:flex');
       await expect(desktopNav).not.toBeVisible();

       // Öffne das Mobile Menu
       await mobileMenuButton.click();

       // Prüfe ob Menu-Items erscheinen
       await expect(
         page.getByRole('link', { name: 'Public News' }),
       ).toBeVisible();
     });
   });
   ```

3. **News Grid Layout auf verschiedenen Viewports testen:**

   ```typescript
   test.describe('News Grid Responsive Layout', () => {
     test('Desktop: zeigt 3 Spalten', async ({ page }) => {
       await page.goto('/news/public');

       const newsGrid = page.getByRole('feed', { name: 'News articles' });
       await expect(newsGrid).toHaveCSS('grid-template-columns', /repeat\(3/);
     });

     test('Tablet: zeigt 2 Spalten', async ({ page }) => {
       // Setze Viewport für Tablet
       await page.setViewportSize({ width: 768, height: 1024 });
       await page.goto('/news/public');

       const newsGrid = page.getByRole('feed', { name: 'News articles' });
       await expect(newsGrid).toHaveCSS('grid-template-columns', /repeat\(2/);
     });

     test('Mobile: zeigt 1 Spalte', async ({ page, isMobile }) => {
       if (!isMobile) {
         await page.setViewportSize({ width: 375, height: 667 });
       }
       await page.goto('/news/public');

       const newsGrid = page.getByRole('feed', { name: 'News articles' });
       await expect(newsGrid).toHaveCSS('grid-template-columns', /repeat\(1/);
     });
   });
   ```

4. **Touch-Gesten testen (optional):**

   ```typescript
   test('Mobile: Touch-Interaktionen', async ({ page, isMobile }) => {
     if (!isMobile) {
       test.skip();
     }

     await page.goto('/news/public');

     // Simuliere Swipe/Scroll
     const newsItem = page.getByRole('article').first();
     await newsItem.scrollIntoViewIfNeeded();

     // Simuliere Touch auf News-Item
     await newsItem.tap();

     // Prüfe Navigation oder Modal
     await expect(page).toHaveURL(/\/news\/\d+/);
   });
   ```

5. **Tests ausführen:**
   - Führe Tests für Desktop aus: `npx playwright test --project=chromium`
   - Führe Tests für Mobile aus: `npx playwright test --project="Mobile Chrome"`
   - Führe alle Tests aus: `npx playwright test`

**Best Practices:**

- Nutze `isMobile` Context-Variable für bedingte Tests
- Teste kritische User Journeys auf mobilen Geräten
- Prüfe Touch-Targets auf ausreichende Größe (min. 44x44px)
- Teste Landscape und Portrait Orientierung bei wichtigen Features

**Zeit:** 25 Minuten

---

> **Tipp:** Verwende `page.setViewportSize()` für spezifische Viewport-Tests. Die `devices` von Playwright enthalten realistische User-Agent Strings und Touch-Support. Nutze den Playwright Inspector (`--debug`) um Mobile-Ansichten visuell zu prüfen.
