# Übung 6 – Mobile und iframe Testing

**Ziel:**
Du lernst, wie du mit Playwright mobile Geräte für die Next.js Feed App emulierst und (anhand eines generischen Beispiels) mit Inhalten innerhalb von iframes interagierst.

**Teil 1: Mobile Emulation (Feed App)**

**Aufgaben:**

1.  **Mobile Projekte in Konfiguration definieren:**
    -   Öffne `playwright.config.ts`.
    -   Stelle sicher, dass unter `projects` mindestens zwei mobile Geräte definiert sind (oder füge sie hinzu), indem du die `devices`-Konfiguration von Playwright nutzt. Kommentiere sie ggf. ein:
        ```typescript
        // playwright.config.ts
        import { defineConfig, devices } from '@playwright/test';

        export default defineConfig({
          // ... andere Konfigurationen ...
          testDir: './e2e',
          use: {
            baseURL: 'http://localhost:3000',
            trace: 'on-first-retry',
            // storageState: 'storageState.json', // Falls benötigt
          },
          projects: [
            {
              name: 'chromium',
              use: { ...devices['Desktop Chrome'] },
            },
            // Mobile Projekte (ggf. einkommentieren):
            {
              name: 'Mobile Chrome', // Android Emulation
              use: { ...devices['Pixel 5'] },
            },
            {
              name: 'Mobile Safari', // iOS Emulation
              use: { ...devices['iPhone 13'] }, // Oder iPhone 12 etc.
            },
            // ... andere Projekte ...
          ],
          // ... webServer etc. ...
        });
        ```
2.  **Responsiven Test für die Navbar schreiben:**
    -   Erstelle eine neue Testdatei (z.B. `e2e/responsive-navbar.spec.ts`).
    -   Schreibe einen Test, der die Startseite (`/`) der Feed App öffnet.
    -   **Test für Desktop:** Prüfe, ob die Desktop-Navigationslinks (`[data-testid="navbar-links-desktop"]`) sichtbar sind und der Mobile-Menü-Toggle (`NavbarMenuToggle`, hat meist `aria-label="Open menu"`) *nicht* sichtbar ist.
        ```typescript
        test('Navbar Desktop View', async ({ page, isMobile }) => {
          test.skip(isMobile, 'Test only runs on desktop');
          await page.goto('/');
          await expect(page.getByTestId('navbar-links-desktop')).toBeVisible();
          await expect(page.getByLabel('Open menu')).toBeHidden();
        });
        ```
    -   **Test für Mobile:** Prüfe, ob die Desktop-Navigationslinks *nicht* sichtbar sind und der Mobile-Menü-Toggle (`getByLabel('Open menu')`) sichtbar ist. Klicke optional den Toggle und prüfe, ob das Menü (`NavbarMenu`) erscheint.
        ```typescript
        test('Navbar Mobile View', async ({ page, isMobile }) => {
          test.skip(!isMobile, 'Test only runs on mobile');
          await page.goto('/');
          await expect(page.getByTestId('navbar-links-desktop')).toBeHidden();
          const menuToggle = page.getByLabel('Open menu');
          await expect(menuToggle).toBeVisible();
          // Optional: Menü öffnen und prüfen
          await menuToggle.click();
          await expect(page.locator('//nav/ul')).toBeVisible(); // Selektor für NavbarMenu anpassen
        });
        ```
3.  **Tests auf mobilen Geräten ausführen:**
    -   Führe die Tests gezielt für die mobilen Projekte aus:
        -   `npx playwright test --project="Mobile Chrome"`
        -   `npx playwright test --project="Mobile Safari"`
    -   Führe sie auch für ein Desktop-Projekt aus, um beide Fälle abzudecken:
        -   `npx playwright test --project=chromium`

**Teil 2: iframe Testing (Generisches Beispiel)**

**Hinweis:** Die Next.js Feed App verwendet derzeit keine iframes. Dieser Teil dient dazu, das Konzept mit einfachen HTML-Dateien zu lernen.

**Vorbereitung:**

*   Erstelle zwei einfache HTML-Dateien im Projektverzeichnis (z.B. im Root oder in einem neuen Ordner `test-html/`):
    *   `iframe-host.html`:
        ```html
        <!DOCTYPE html>
        <html>
        <head><title>Host Page</title></head>
        <body>
          <h1>Host Page Content</h1>
          <iframe id="my-iframe" src="./iframe-content.html" width="600" height="400"></iframe>
        </body>
        </html>
        ```
    *   `iframe-content.html`:
        ```html
        <!DOCTYPE html>
        <html>
        <head><title>iframe Content</title></head>
        <body>
          <h2>Content inside iframe</h2>
          <form>
            <label for="nameInput">Your Name:</label>
            <input type="text" id="nameInput" aria-label="Your Name">
            <button type="button" onclick="document.getElementById('message').style.display='block'">Submit</button>
          </form>
          <p id="message" style="display:none; color:green;">Submitted!</p>
        </body>
        </html>
        ```

**Aufgaben:**

4.  **Test für iframe erstellen:**
    -   Erstelle eine neue Testdatei (z.B. `e2e/iframe.spec.ts`).
    -   Schreibe einen Test, der die lokale `iframe-host.html`-Seite öffnet. **Wichtig:** Verwende den relativen Pfad oder `file:///...` zur Datei.
        ```typescript
        // e2e/iframe.spec.ts
        import { test, expect } from '@playwright/test';
        import path from 'path';

        test('Interact with iframe content', async ({ page }) => {
          // Passe den Pfad an, falls du die Dateien in 'test-html/' abgelegt hast
          const hostFilePath = path.join(__dirname, '..', 'iframe-host.html');
          await page.goto(`file://${hostFilePath}`);
          // ... Rest des Tests
        });
        ```
5.  **Auf iframe zugreifen:**
    -   Verwende `page.frameLocator()` um den iframe anhand seiner ID zu finden:
        ```typescript
        const frame = page.frameLocator('#my-iframe');
        ```
6.  **Mit iframe-Inhalt interagieren:**
    -   Verwende den `frameLocator`, um Elemente *innerhalb* des iframes anzusprechen:
        -   Fülle das Eingabefeld aus: `await frame.getByLabel('Your Name').fill('Test User');`
        -   Klicke den Button: `await frame.getByRole('button', { name: 'Submit' }).click();`
7.  **Assertions im iframe:**
    -   Prüfe, ob nach dem Klick die Erfolgsmeldung (`#message`) *innerhalb* des iframes sichtbar wird:
        ```typescript
        await expect(frame.locator('#message')).toBeVisible();
        await expect(frame.locator('#message')).toContainText('Submitted!');
        ```
8.  **Test ausführen:**
    -   Führe den iframe-Test aus (`npx playwright test iframe.spec.ts`).

**Zeit:** 30 Minuten

---

> **Tipp:** Für Mobile Tests ist die `isMobile` Property im Test-Callback nützlich. `frameLocator` ist der bevorzugte Weg, um mit iframes zu interagieren, da er auf den Frame wartet. Beim Öffnen lokaler HTML-Dateien muss der korrekte Pfad (absolut oder relativ zum Test) verwendet werden.
