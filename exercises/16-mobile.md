# Übung 16 – Mobile Testing

**Ziel:**
Du lernst, wie du mit Playwright mobile Geräte emulierst und responsive Designs testest. Der Fokus liegt auf praktischen Tests für die Next.js Feed App.

> **🧵 Roter Faden**
> **Baut auf (weich):** Übung 9 – optionaler `NewsPage`-POM-Reuse zum Navigieren von `/` und dem Feed.
> **Zurückgefallen?** `page.goto()` reicht; die POM ist hier nur Komfort.

**Breakpoints der App (Tailwind):** Hamburger-Menü unter `sm` (640px), Desktop-Navigation ab `lg` (1024px), News-Grid mit 2 Spalten ab `md` (768px) und 3 Spalten ab `lg`.

**Aufgaben:**

1. **Mobile Projekte in der Konfiguration prüfen:**
   - Öffne `playwright.config.ts`
   - Die Mobile-Projekte sind bereits aktiv – **ein Projekt pro Gerät**. Mehrere `devices` in ein `use` zu spreaden überschreibt sich gegenseitig:

   ```typescript
   projects: [
     // Desktop Browser
     {
       name: 'chromium',
       use: { ...devices['Desktop Chrome'] },
     },
     // Mobile Devices
     {
       name: 'Mobile iPhone',
       use: { ...devices['iPhone 17 Pro'] },
     },
     {
       name: 'Mobile Android',
       use: { ...devices['Pixel 10 Pro XL'] },
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
       const desktopNav = page.getByRole('navigation', {
         name: 'Main navigation',
         exact: true,
       });
       await expect(desktopNav).toBeVisible();

       // Mobile Menu Button sollte nicht sichtbar sein
       const mobileMenuButton = page.getByRole('button', { name: 'Open menu' });
       await expect(mobileMenuButton).toBeHidden();
     });

     test('Mobile: zeigt Hamburger Menu', async ({ page, isMobile }) => {
       // Dieser Test läuft nur auf mobilen Geräten
       // (isMobile wird in Firefox nicht unterstützt)
       test.skip(!isMobile, 'Nur auf Mobile-Projekten');

       await page.goto('/');

       // Mobile Menu Button sollte sichtbar sein
       const mobileMenuButton = page.getByRole('button', { name: 'Open menu' });
       await expect(mobileMenuButton).toBeVisible();

       // Desktop Navigation sollte nicht sichtbar sein
       const desktopNav = page.getByRole('navigation', {
         name: 'Main navigation',
         exact: true,
       });
       await expect(desktopNav).toBeHidden();

       // Öffne das Mobile Menu
       await mobileMenuButton.click();

       // Prüfe ob Menu-Items erscheinen
       const mobileNav = page.getByRole('navigation', {
         name: 'Mobile navigation',
       });
       await expect(
         mobileNav.getByRole('link', { name: 'Navigate to Public News' }),
       ).toBeVisible();
     });
   });
   ```

3. **News Grid Layout auf verschiedenen Viewports testen:**
   - `toHaveCSS` vergleicht den **berechneten** Wert – `grid-template-columns` liefert px-Werte (z.B. `"394.656px 394.672px 394.656px"`), nicht `repeat(3, …)`.

   ```typescript
   test.describe('News Grid Responsive Layout', () => {
     test('Desktop: zeigt 3 Spalten', async ({ page }) => {
       await page.goto('/news/public');

       const newsGrid = page.getByRole('feed', { name: 'News articles' });
       await expect(newsGrid).toHaveCSS(
         'grid-template-columns',
         /^[\d.]+px [\d.]+px [\d.]+px$/,
       );
     });

     test('Tablet: zeigt 2 Spalten', async ({ page }) => {
       // Setze Viewport für Tablet
       await page.setViewportSize({ width: 768, height: 1024 });
       await page.goto('/news/public');

       const newsGrid = page.getByRole('feed', { name: 'News articles' });
       await expect(newsGrid).toHaveCSS(
         'grid-template-columns',
         /^[\d.]+px [\d.]+px$/,
       );
     });

     test('Mobile: zeigt 1 Spalte', async ({ page, isMobile }) => {
       if (!isMobile) {
         await page.setViewportSize({ width: 375, height: 667 });
       }
       await page.goto('/news/public');

       const newsGrid = page.getByRole('feed', { name: 'News articles' });
       await expect(newsGrid).toHaveCSS('grid-template-columns', /^[\d.]+px$/);
     });
   });
   ```

4. **Touch-Gesten testen (optional):**
   - `tap()` braucht einen Context mit `hasTouch: true` – die Device-Emulation setzt das.
   - `test.use({ ...devices['iPhone 13'] })` gehört an den Anfang der Datei: `defaultBrowserType` darf nicht in einem `describe` gesetzt werden.

   ```typescript
   // e2e/touch.spec.ts
   import { test, expect, devices } from '@playwright/test';

   test.use({ ...devices['iPhone 13'] }); // setzt hasTouch und isMobile

   test('Mobile: Touch-Interaktionen', async ({ page }) => {
     await page.goto('/');

     // Simuliere Touch auf den Hamburger-Button
     await page.getByRole('button', { name: 'Open menu' }).tap();

     const mobileNav = page.getByRole('navigation', {
       name: 'Mobile navigation',
     });
     await mobileNav.getByRole('link', { name: 'Navigate to Public News' }).tap();

     // Prüfe Navigation
     await expect(page).toHaveURL('/news/public');
     await expect(page.getByRole('article').first()).toBeVisible();
   });
   ```

5. **Tests ausführen:**
   - Führe Tests für Desktop aus: `npx playwright test --project=chromium`
   - Führe Tests für Mobile aus: `npx playwright test --project="Mobile Android"`
   - Führe alle Tests aus: `npx playwright test`

**Best Practices:**

- Nutze `isMobile` Context-Variable für bedingte Tests (in Firefox nicht unterstützt)
- Ein Projekt pro Gerät – nie mehrere `devices` in ein Projekt spreaden
- Teste kritische User Journeys auf mobilen Geräten
- Prüfe Touch-Targets auf ausreichende Größe (min. 44x44px)
- Teste Landscape und Portrait Orientierung bei wichtigen Features
- Barrierefreiheits-Präferenzen emulierst du ab v1.63 direkt als Test-Optionen: `test.use({ reducedMotion: 'reduce', forcedColors: 'active', contrast: 'more' })`
- Geolocation immer mit Namen angeben: `geolocation: { latitude: 48.8584, longitude: 2.2945 }` plus `permissions: ['geolocation']`

**Zeit:** 25 Minuten

---

> **Tipp:** Verwende `page.setViewportSize()` für spezifische Viewport-Tests. Die `devices` von Playwright enthalten realistische User-Agent Strings und Touch-Support. Nutze den Playwright Inspector (`--debug`) um Mobile-Ansichten visuell zu prüfen.
