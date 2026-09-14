# Übung 3 – Interaktionen in der Feed App

**Ziel:**
Du lernst verschiedene Benutzer-Interaktionen mit der Feed App zu testen. Der Fokus liegt auf realistischen Aktionen wie Klicks, Eingaben, Auswahllisten und Tastatur-Navigation.

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

     // Vom Seitenanfang aus liegen Skip-Link und Navbar vor dem Suchfeld (ca. 10× Tab).
     // Klick auf die Überschrift setzt den Startpunkt der Tab-Navigation direkt davor.
     await page.getByRole('heading', { name: 'News Feed' }).click();
     await page.keyboard.press('Tab');

     // Prüfe ob Suchfeld fokussiert ist
     const searchInput = page.getByRole('textbox', {
       name: 'Search news articles',
     });
     await expect(searchInput).toBeFocused();

     // Tippe Suchbegriff Zeichen für Zeichen (echte Tastenanschläge)
     await searchInput.pressSequentially('Playwright');

     // Enter zum Suchen
     await page.keyboard.press('Enter');

     // Prüfe ob gefiltert wurde: weniger als alle Items (wartet automatisch)
     await expect(results).not.toHaveCount(initialCount);
   });
   ```

3. **Nach Kategorie filtern (Auswahlliste):**

   ```typescript
   test('News nach Kategorie filtern', async ({ page }) => {
     await page.goto('/news/public');

     const articles = page
       .getByRole('feed', { name: 'News articles' })
       .getByRole('article');

     // Offline-Feed (RSS_OFFLINE_MODE=true): 20 Artikel, davon 5 in "Business"
     await expect(articles).toHaveCount(20);

     // Ein <select> hat die Rolle combobox, selectOption() wählt per Label oder Value
     await page
       .getByRole('combobox', { name: 'Filter news by category' })
       .selectOption('Business');

     await expect(page.getByText('5 articles found', { exact: true })).toBeVisible();
     await expect(articles).toHaveCount(5);
   });
   ```

4. **Formular-Interaktionen (Login):**

   ```typescript
   test('Login Formular Validierung', async ({ page }) => {
     await page.goto('/auth/signin');

     const emailInput = page.getByLabel('Email');
     const passwordInput = page.getByLabel('Password');
     const submitButton = page.getByRole('button', {
       name: 'Submit sign in form',
     });

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

     // Prüfe auf Fehlermeldung (per Text, denn auch der Next.js Route Announcer hat role="alert")
     await expect(
       page.getByRole('alert').filter({ hasText: 'Invalid email or password' }),
     ).toBeVisible();

     // Teste mit korrekten Daten des Test-Users aus der .env
     await emailInput.fill(process.env.TEST_USER_EMAIL ?? 'test@example.com');
     await passwordInput.fill(process.env.TEST_USER_PASSWORD ?? 'password');
     await submitButton.click();

     // Sollte weitergeleitet werden
     await expect(page).not.toHaveURL('/auth/signin');
   });
   ```

**Best Practices:**

- ✅ Nutze realistische Benutzer-Flows
- ✅ Teste Tastatur-Navigation für Accessibility, Fokus prüfst du mit `toBeFocused()`
- ✅ Validiere Formular-Verhalten vollständig
- ✅ Berücksichtige verschiedene Eingabe-Methoden (Klick, Tastatur, Auswahlliste)
- ❌ Keine bedingten Tests wie `if (await button.isVisible())`: ein Test prüft einen festen, bekannten Zustand
- ❌ Vermeide feste Wartezeiten (`waitForTimeout`, `networkidle`), nutze Auto-Waiting und Web-First Assertions

**Zeit:** 20 Minuten

---

> **Tipp:** Nutze `page.pause()` während der Entwicklung, um Interaktionen Schritt für Schritt zu debuggen. Der Playwright Inspector zeigt dir genau, welche Aktionen ausgeführt werden!
