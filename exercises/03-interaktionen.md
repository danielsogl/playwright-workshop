# Übung 3 – Interaktionen in der Feed App

**Ziel:**
Du lernst verschiedene Benutzer-Interaktionen mit der Feed App zu testen. Der Fokus liegt auf realistischen Aktionen wie Klicks, Eingaben, Hover-Effekte und Tastatur-Navigation.

> **🧵 Roter Faden**
> **Baut auf:** Übung 2 – dieselben Elemente (Theme-Toggle, Suche, Login-Form), jetzt interaktiv.
> **Du gibst weiter:** Interaktions-Muster (fill, click, keyboard), u. a. den Login-Flow, den Übung 7 zum Auth-Setup ausbaut.
> **Zurückgefallen?** Alle Locators stehen in den Snippets unten – Übung 2 ist keine harte Voraussetzung.

**Warum Interaktions-Tests?**

- Simulieren echte Nutzer-Aktionen
- Prüfen der UI-Responsivität
- Testen von dynamischen Elementen
- Validieren von Formular-Verhalten

**Aufgaben:**

1. **Theme Toggle Interaktion:**

   ```typescript
   // e2e/interactions.spec.ts
   import { test, expect } from '@playwright/test';

   test.describe('Feed App Interaktionen', () => {
     test('Theme umschalten', async ({ page }) => {
       await page.goto('/');

       // Finde den Theme Toggle Button
       const themeToggle = page
         .getByRole('button', { name: /theme|dark|light/i })
         .first();

       // Prüfe initialen Zustand
       const htmlElement = page.locator('html');
       const initialTheme = (await htmlElement.getAttribute('class')) || '';

       // Klicke auf Theme Toggle
       await themeToggle.click();

       // Prüfe ob Theme gewechselt hat
       const newTheme = (await htmlElement.getAttribute('class')) || '';
       expect(newTheme).not.toBe(initialTheme);

       // Toggle zurück
       await themeToggle.click();
       const finalTheme = (await htmlElement.getAttribute('class')) || '';
       expect(finalTheme).toBe(initialTheme);
     });
   });
   ```

2. **Suche mit Tastatur-Navigation:**

   ```typescript
   test('Suche mit Tastatur bedienen', async ({ page }) => {
     await page.goto('/news/public');

     // Tab zur Suchleiste
     await page.keyboard.press('Tab');
     await page.keyboard.press('Tab'); // Je nach Layout mehrmals

     // Prüfe ob Suchfeld fokussiert ist
     const searchInput = page.getByPlaceholder(/search|suche/i);
     await expect(searchInput).toBeFocused();

     // Tippe Suchbegriff
     await page.keyboard.type('Playwright');

     // Enter zum Suchen
     await page.keyboard.press('Enter');

     // Warte auf Ergebnisse
     await page.waitForLoadState('networkidle');

     // Prüfe ob gefiltert wurde
     const results = page.getByRole('article');
     const count = await results.count();
     expect(count).toBeLessThan(65); // Weniger als alle Items
   });
   ```

3. **News Card Hover-Effekte:**

   ```typescript
   test('News Card Hover zeigt zusätzliche Optionen', async ({ page }) => {
     await page.goto('/news/public');
     await page.waitForSelector('[role="article"]');

     const firstCard = page.getByRole('article').first();

     // Hover über die Karte
     await firstCard.hover();

     // Prüfe ob Hover-Effekte sichtbar sind (z.B. Schatten, Buttons)
     // Dies hängt vom tatsächlichen Design ab
     const cardBox = await firstCard.boundingBox();
     if (cardBox) {
       // Screenshot der gehöverten Karte
       await firstCard.screenshot({ path: 'hover-card.png' });
     }

     // Klicke auf Link in der Karte
     const cardLink = firstCard.getByRole('link').first();
     const href = await cardLink.getAttribute('href');
     expect(href).toBeTruthy();

     // Rechtsklick für Kontext-Menü
     await cardLink.click({ button: 'right' });

     // ESC zum Schließen des Kontext-Menüs
     await page.keyboard.press('Escape');
   });
   ```

4. **Formular-Interaktionen (Login):**

   ```typescript
   test('Login Formular Validierung', async ({ page }) => {
     await page.goto('/auth/signin');

     const emailInput = page.getByLabel(/email/i);
     const passwordInput = page.getByLabel(/password/i);
     const submitButton = page.getByRole('button', { name: /sign in/i });

     // Teste leeres Formular
     await submitButton.click();

     // Erwarte Validierungs-Fehler (falls vorhanden)
     // oder dass wir noch auf der Login-Seite sind
     await expect(page).toHaveURL('/auth/signin');

     // Fülle nur Email aus
     await emailInput.fill('test@example.com');
     await submitButton.click();

     // Sollte immer noch auf Login-Seite sein (Passwort fehlt)
     await expect(page).toHaveURL('/auth/signin');

     // Fülle Passwort aus
     await passwordInput.fill('wrongpassword');
     await submitButton.click();

     // Prüfe auf Fehlermeldung
     const errorMessage = page.getByText(/invalid|incorrect|falsch/i);
     await expect(errorMessage)
       .toBeVisible({ timeout: 5000 })
       .catch(() => {
         // Falls keine Fehlermeldung, prüfe URL
         expect(page.url()).toContain('/auth/signin');
       });

     // Teste mit korrekten Daten
     await emailInput.clear();
     await emailInput.fill('admin@example.com');
     await passwordInput.clear();
     await passwordInput.fill('admin123');
     await submitButton.click();

     // Sollte weitergeleitet werden
     await expect(page).not.toHaveURL('/auth/signin');
   });
   ```

5. **Drag & Drop (falls vorhanden) oder Scroll-Verhalten:**

   ```typescript
   test('Infinite Scroll oder Pagination', async ({ page }) => {
     await page.goto('/news/public');

     // Scrolle zum Ende der Seite
     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

     // Warte kurz
     await page.waitForTimeout(500);

     // Prüfe ob mehr Items geladen wurden oder Pagination sichtbar ist
     const loadMoreButton = page.getByRole('button', {
       name: /load more|mehr laden/i,
     });
     const paginationNext = page.getByRole('link', { name: /next|weiter/i });

     if (await loadMoreButton.isVisible()) {
       await loadMoreButton.click();
       await page.waitForLoadState('networkidle');
     } else if (await paginationNext.isVisible()) {
       await paginationNext.click();
       await page.waitForLoadState('networkidle');
     }

     // Scrolle zurück nach oben
     await page.evaluate(() => window.scrollTo(0, 0));

     // Prüfe ob Scroll-to-Top Button erscheint
     const scrollTopButton = page.getByRole('button', { name: /top|up/i });
     if (await scrollTopButton.isVisible()) {
       await scrollTopButton.click();
       // Prüfe ob wir oben sind
       const scrollY = await page.evaluate(() => window.scrollY);
       expect(scrollY).toBeLessThanOrEqual(100);
     }
   });
   ```

6. **Multi-Select und Bulk-Aktionen:**

   ```typescript
   test('Mehrere Items auswählen', async ({ page }) => {
     await page.goto('/news/public');

     // Falls Checkboxen vorhanden sind
     const checkboxes = page.getByRole('checkbox');
     const checkboxCount = await checkboxes.count();

     if (checkboxCount > 0) {
       // Wähle erste 3 Items
       for (let i = 0; i < Math.min(3, checkboxCount); i++) {
         await checkboxes.nth(i).check();
       }

       // Prüfe ob Bulk-Aktionen erscheinen
       const bulkActions = page.getByText(/selected|ausgewählt/i);
       await expect(bulkActions).toBeVisible();

       // Wähle alle ab mit Strg+Klick
       await checkboxes.first().click({ modifiers: ['Control'] });
     }

     // Alternative: Mehrfachauswahl mit Shift
     const items = page.getByRole('article');
     if ((await items.count()) > 3) {
       await items.first().click();
       await items.nth(2).click({ modifiers: ['Shift'] });
     }
   });
   ```

**Best Practices:**

- ✅ Nutze realistische Benutzer-Flows
- ✅ Teste Tastatur-Navigation für Accessibility
- ✅ Prüfe Hover-States und Fokus-Indikatoren
- ✅ Validiere Formular-Verhalten vollständig
- ✅ Berücksichtige verschiedene Eingabe-Methoden
- ❌ Vermeide zu schnelle Aktionen ohne Wartezeiten

**Zeit:** 25 Minuten

---

> **Tipp:** Nutze `page.pause()` während der Entwicklung, um Interaktionen Schritt für Schritt zu debuggen. Der Playwright Inspector zeigt dir genau, welche Aktionen ausgeführt werden!
