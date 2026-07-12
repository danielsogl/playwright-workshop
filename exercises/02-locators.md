# Übung 2 – Locators kennenlernen

**Ziel:**
Du wendest verschiedene Locator-Strategien praktisch an. Fokus: Elemente **finden** – noch keine Assertions, nur finden und loggen.

> **🧵 Roter Faden**
> **Baut auf:** Übung 1 – lauffähiges Setup.
> **Du gibst weiter:** dein Locator-Vokabular für die Seiten `/` und `/news/public`, die Tag 1 tragen (eingelöst in Übung 4).
> **Zurückgefallen?** Kein Vorarbeit nötig – die App läuft über den `webServer` automatisch, nur `npm install`.

**Aufgaben:**

1. **Neuer Test:** Erstelle `e2e/locators-practice.spec.ts` und übe auf der Startseite verschiedene Locator-Typen.

   ```typescript
   import { test } from '@playwright/test';

   test('verschiedene Locator-Strategien verwenden', async ({ page }) => {
     await page.goto('/');

     // Nach Rolle + Name
     const publicNewsLink = page.getByRole('link', { name: /view public news/i });
     console.log('Public-News-Link gefunden:', await publicNewsLink.count());

     // Nach sichtbarem Text
     const welcome = page.getByText('Welcome to');
     console.log('Welcome-Text sichtbar:', await welcome.isVisible());

     // Der Theme-Umschalter hat die Rolle "switch"
     const themeToggle = page.getByRole('switch').first();
     console.log('Theme-Toggle gefunden:', await themeToggle.count());
   });
   ```

2. **Auf der News-Seite weitere Locators üben:**

   ```typescript
   test('Locators auf der News-Seite', async ({ page }) => {
     await page.goto('/news/public');

     // Überschrift über den sichtbaren Text
     const heading = page.getByText('News Feed');
     console.log('Überschrift sichtbar:', await heading.isVisible());

     // Suchfeld über den Platzhalter
     const searchBox = page.getByPlaceholder('Search news');
     console.log('Suchfeld gefunden:', await searchBox.count());

     // Alle Artikel über die Rolle
     const articles = page.getByRole('article');
     console.log('Anzahl Artikel:', await articles.count());

     // Verkettung: Überschrift des ersten Artikels
     const firstTitle = articles.first().getByRole('heading');
     console.log('Erster Titel:', await firstTitle.textContent());
   });
   ```

3. **Experiment:** Öffne den UI-Mode (`npx playwright test --ui`) und nutze den **Locator-Playground** („Pick locator"), um live zu sehen, welche Locators Playwright vorschlägt.

**Best Practices:**

- ✅ Bevorzuge User-facing Locators (`getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`)
- ❌ Vermeide CSS-/XPath-Selektoren

**Hinweis:** Noch KEINE Assertions – nur Elemente finden und loggen. Assertions kommen in Übung 4.

**Zeit:** 15 Minuten
