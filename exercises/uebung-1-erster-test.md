# Übung 1 – Erster Test mit Locators

**Ziel:**
Du lernst die Grundlagen von Playwright: Semantic Locators, Auto-Waiting und Assertions. Der Fokus liegt auf benutzerorientierten Selektoren statt technischen Details.

**Aufgaben:**

1. **Testdatei erstellen:**
   - Erstelle `e2e/first-test.spec.ts`

2. **Navigation und Auto-Waiting verstehen:**

   ```typescript
   import { test, expect } from '@playwright/test';

   test('navigiert zur Public News Seite', async ({ page }) => {
     // Navigiere zur Startseite
     await page.goto('/');

     // Finde den Link über seinen sichtbaren Text
     const newsLink = page.getByRole('link', { name: 'View Public News' });

     // Playwright wartet automatisch bis der Link klickbar ist!
     await newsLink.click();

     // Auto-wait: Wartet bis die URL sich ändert
     await expect(page).toHaveURL('/news/public');

     // Auto-wait: Wartet bis die Überschrift sichtbar ist
     await expect(
       page.getByRole('heading', { name: 'News Feed' }),
     ).toBeVisible();
   });
   ```

3. **Semantic Locators verwenden:**

   ```typescript
   test('verwendet verschiedene semantische Locators', async ({ page }) => {
     await page.goto('/auth/signin');

     // Nach Rolle und Name (Regex = case-insensitiver Teiltreffer)
     const signInButton = page.getByRole('button', { name: /sign in/i });

     // Nach Label (ideal für Formularfelder)
     const emailInput = page.getByLabel('Email');
     const passwordInput = page.getByLabel('Password');

     // Nach Platzhalter (dasselbe Feld, anderer Locator)
     const emailByPlaceholder = page.getByPlaceholder('you@example.com');

     // Nach sichtbarem Text
     const introText = page.getByText('Sign in to access');

     // getByTestId nur als letzte Option, wenn kein semantischer Locator passt

     // Alle Locators unterstützen Auto-Waiting
     await expect(signInButton).toBeVisible();
     await expect(emailInput).toBeEditable();
     await expect(passwordInput).toBeEditable();
     await expect(emailByPlaceholder).toBeVisible();
     await expect(introText).toBeVisible();
   });
   ```

4. **Multiple Elemente und Filtering:**

   ```typescript
   test('arbeitet mit Listen von Elementen', async ({ page }) => {
     await page.goto('/news/public');

     // Finde alle News-Artikel
     const allArticles = page.getByRole('article');

     // Zähle die Artikel (Auto-Wait inklusive!)
     const count = await allArticles.count();
     expect(count).toBeGreaterThan(0);

     // Finde den ersten Artikel
     const firstArticle = allArticles.first();
     await expect(firstArticle).toBeVisible();

     // Filtere Artikel die "Technology" enthalten
     const techArticles = allArticles.filter({ hasText: 'Technology' });
     const techCount = await techArticles.count();
     console.log(`Found ${techCount} technology articles`);
   });
   ```

5. **Test ausführen und debuggen:**

   ```bash
   # Normal ausführen
   npx playwright test first-test.spec.ts

   # Im Debug-Modus mit Playwright Inspector
   npx playwright test first-test.spec.ts --debug

   # Mit UI Mode für bessere Übersicht
   npx playwright test --ui
   ```

**Best Practices:**

- ✅ Verwende semantische Locators (`getByRole`, `getByLabel`, `getByText`)
- ✅ Vertraue auf Auto-Waiting - keine manuellen Waits nötig!
- ✅ Schreibe Tests aus Benutzersicht
- ❌ Vermeide CSS/XPath-Selektoren
- ❌ Vermeide `page.waitForTimeout()` - nutze stattdessen Assertions

**Zeit:** 20 Minuten

---

> **Tipp:** Der Playwright Inspector (`--debug`) zeigt dir, wie Playwright Elemente findet und wartet. Nutze ihn um zu verstehen, wie Auto-Waiting funktioniert!
