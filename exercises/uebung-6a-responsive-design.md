# Übung 6A – Responsive Design Testing (Feed App)

**Ziel:**
Du implementierst umfassende Tests für das responsive Design der Next.js Feed App unter Verwendung von Playwright's Device Emulation und Visual Testing Features.

**Aufgaben:**

1. **Test-Projekt Setup:**
   ```typescript
   // playwright.config.ts
   import { defineConfig, devices } from '@playwright/test';

   export default defineConfig({
     testDir: './e2e',
     use: {
       baseURL: 'http://localhost:3000',
     },
     projects: [
       // Desktop Chrome
       {
         name: 'desktop-chrome',
         use: { 
           ...devices['Desktop Chrome'],
           viewport: { width: 1280, height: 800 }
         },
       },
       // Tablet Safari
       {
         name: 'tablet-safari',
         use: { ...devices['iPad Mini'] },
       },
       // Mobile Chrome
       {
         name: 'mobile-chrome',
         use: { ...devices['Pixel 5'] },
       }
     ],
   });
   ```

2. **Responsive Layout Tests implementieren:**
   ```typescript
   // e2e/responsive.spec.ts
   import { test, expect } from '@playwright/test';

   test.describe('Responsive Layout Tests', () => {
     test.beforeEach(async ({ page }) => {
       await page.goto('/');
     });

     test('Navigation Layout anpassen', async ({ page, isMobile }) => {
       // Test der Navigation basierend auf Viewport
       const menuButton = page.getByRole('button', { name: 'Menu' });
       const desktopNav = page.getByTestId('desktop-nav');
       
       if (isMobile) {
         // Mobile Layout Tests
         await expect(menuButton).toBeVisible();
         await expect(desktopNav).toBeHidden();
         
         // Menü Interaktion
         await menuButton.click();
         await expect(page.getByTestId('mobile-nav')).toBeVisible();
       } else {
         // Desktop Layout Tests
         await expect(menuButton).toBeHidden();
         await expect(desktopNav).toBeVisible();
       }
     });

     test('News Grid Layout', async ({ page }) => {
       await page.goto('/news/public');
       
       // Warte auf Grid-Layout
       const newsGrid = page.getByTestId('news-grid');
       await expect(newsGrid).toBeVisible();
       
       // Screenshot für visuellen Vergleich
       await expect(newsGrid).toHaveScreenshot('news-grid.png', {
         mask: [page.getByTestId('timestamp')] // Maskiere dynamische Elemente
       });
     });
   });
   ```

3. **Touch-Interaktionen testen:**
   ```typescript
   // e2e/mobile-interactions.spec.ts
   import { test, expect } from '@playwright/test';

   test.describe('Mobile Touch Interactions', () => {
     // Nur für mobile Projekte ausführen
     test.use({ viewport: devices['Pixel 5'].viewport });

     test('Touch Navigation', async ({ page }) => {
       await page.goto('/');

       // Menu öffnen mit Touch
       const menuButton = page.getByRole('button', { name: 'Menu' });
       await menuButton.tap();

       // Navigation prüfen
       const navItem = page.getByRole('link', { name: 'Public News' });
       await navItem.tap();
       
       // URL und Seiteninhalt prüfen
       await expect(page).toHaveURL('/news/public');
       await expect(page.getByTestId('public-news-title')).toBeVisible();
     });

     test('Pull-to-Refresh Simulation', async ({ page }) => {
       await page.goto('/news/public');
       
       // Gesture API verwenden
       await page.mouse.move(200, 200);
       await page.mouse.down();
       await page.mouse.move(200, 400, { steps: 10 }); // Smooth movement
       await page.mouse.up();
       
       // Prüfe ob Refresh-Indikator erscheint
       await expect(page.getByTestId('refresh-indicator')).toBeVisible();
     });
   });
   ```

4. **Visual Testing Setup:**
   ```typescript
   // e2e/visual.spec.ts
   import { test, expect } from '@playwright/test';

   test.describe('Visual Regression Tests', () => {
     test('Capture Full Page Screenshots', async ({ page }) => {
       const pages = [
         '/',
         '/news/public',
         '/news/private'
       ];

       for (const path of pages) {
         await page.goto(path);
         await expect(page).toHaveScreenshot(`${path.replace('/', '-')}.png`, {
           fullPage: true,
           mask: [
             page.getByTestId('timestamp'),
             page.getByTestId('user-avatar')
           ],
           threshold: 0.2 // Toleranz für kleine Unterschiede
         });
       }
     });

     test('Component-specific Screenshots', async ({ page }) => {
       await page.goto('/news/public');
       
       // Spezifische Komponenten testen
       const components = {
         'navigation': page.getByRole('navigation'),
         'news-grid': page.getByTestId('news-grid'),
         'footer': page.getByRole('contentinfo')
       };

       for (const [name, locator] of Object.entries(components)) {
         await expect(locator).toHaveScreenshot(`${name}.png`);
       }
     });
   });
   ```

**Vorteile dieser Implementierung:**
- Verwendet Playwright's eingebaute Device-Emulation
- Kombiniert funktionale und visuelle Tests
- Berücksichtigt Touch-Events und mobile Gesten
- Strukturierte Projekt-Konfiguration für verschiedene Viewports
- Effiziente Screenshot-Vergleiche mit Masking für dynamische Inhalte

**Best Practices:**
- Verwende `toHaveScreenshot()` statt manueller Screenshots
- Nutze Device Descriptors statt manueller Viewport-Größen
- Maskiere dynamische Inhalte in Screenshots
- Gruppiere Tests nach Funktionalität und Viewport
- Verwende semantische Selektoren (Role, TestId)

**Zeit:** 45 Minuten

---

> **Tipp:** Verwende `npx playwright test --update-snapshots` um Basis-Screenshots zu erstellen oder zu aktualisieren. Nutze die UI-Mode (`npx playwright test --ui`) für die visuelle Inspektion der Screenshots und Debugging von Layout-Problemen.
