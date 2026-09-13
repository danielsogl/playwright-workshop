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

       // Finde den Theme-Toggle (role="switch", gibt es für Desktop und Mobile)
       // visible() nimmt nur den sichtbaren
       const themeToggle = page
         .getByRole('switch', { name: /dark|light/i })
         .visible();

       // Merke initialen Zustand
       const htmlElement = page.locator('html');
       const initialTheme = (await htmlElement.getAttribute('class')) || '';

       // Klicke auf Theme Toggle
       await themeToggle.click();

       // Prüfe ob Theme gewechselt hat (wartet automatisch)
       await expect(htmlElement).not.toHaveClass(initialTheme);

       // Toggle zurück
       await themeToggle.click();
       await expect(htmlElement).toHaveClass(initialTheme);
     });
   });
   ```

2. **Suche mit Tastatur-Navigation:**

   ```typescript
   test('Suche mit Tastatur bedienen', async ({ page }) => {
     await page.goto('/news/public');

     // Warte bis die Artikel geladen sind und merke die Anzahl
     const results = page.getByRole('article');
     await expect(results.first()).toBeVisible();
     const initialCount = await results.count();

     // Tab zur Suchleiste
     await page.keyboard.press('Tab');
     await page.keyboard.press('Tab'); // Je nach Layout mehrmals

     // Prüfe ob Suchfeld fokussiert ist
     const searchInput = page.getByPlaceholder(/search|suche/i);
     await expect(searchInput).toBeFocused();

     // Tippe Suchbegriff Zeichen für Zeichen (echte Tastenanschläge)
     await searchInput.pressSequentially('Playwright');

     // Enter zum Suchen
     await page.keyboard.press('Enter');

     // Prüfe ob gefiltert wurde: weniger als alle Items (wartet automatisch)
     await expect(results).not.toHaveCount(initialCount);
   });
   ```

3. **News Card Hover-Effekte:**

   ```typescript
   test('News Card Hover zeigt zusätzliche Optionen', async ({ page }) => {
     await page.goto('/news/public');

     const firstCard = page.getByRole('article').first();
     await expect(firstCard).toBeVisible();

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
     await expect(cardLink).toHaveAttribute('href', /.+/);

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
     await expect(page.getByRole('alert')).toContainText(/invalid/i);

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

     // Warte bis die Artikel geladen sind und merke die Anzahl
     const articles = page.getByRole('article');
     await expect(articles.first()).toBeVisible();
     const initialCount = await articles.count();

     // Scrolle zum Ende der Seite
     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

     // Prüfe ob mehr Items geladen wurden oder Pagination sichtbar ist
     const loadMoreButton = page.getByRole('button', {
       name: /load more|mehr laden/i,
     });
     const paginationNext = page.getByRole('link', { name: /next|weiter/i });

     // isVisible() wartet nicht, hier gewollt, da die Elemente optional sind
     if (await loadMoreButton.isVisible()) {
       await loadMoreButton.click();
       // Web-First Assertion statt networkidle: warte auf neue Items
       await expect(articles).not.toHaveCount(initialCount);
     } else if (await paginationNext.isVisible()) {
       await paginationNext.click();
       await expect(articles.first()).toBeVisible();
     }

     // Scrolle zurück nach oben
     await page.evaluate(() => window.scrollTo(0, 0));

     // Prüfe ob Scroll-to-Top Button erscheint
     const scrollTopButton = page.getByRole('button', { name: /top|up/i });
     if (await scrollTopButton.isVisible()) {
       await scrollTopButton.click();
       // Prüfe ob wir oben sind: expect.poll wiederholt, bis das Scrollen fertig ist
       await expect
         .poll(() => page.evaluate(() => window.scrollY))
         .toBeLessThanOrEqual(100);
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

       // Wähle ab mit Strg+Klick (ControlOrMeta = Cmd unter macOS)
       await checkboxes.first().click({ modifiers: ['ControlOrMeta'] });
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
- ❌ Vermeide feste Wartezeiten (`waitForTimeout`, `networkidle`), nutze Auto-Waiting und Web-First Assertions

**Zeit:** 25 Minuten

---

> **Tipp:** Nutze `page.pause()` während der Entwicklung, um Interaktionen Schritt für Schritt zu debuggen. Der Playwright Inspector zeigt dir genau, welche Aktionen ausgeführt werden!
