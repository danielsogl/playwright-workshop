# Übung 1 – Erster Test

**Ziel:**
Du schreibst deinen ersten Playwright-Test für die Next.js Feed Demo App.

**Aufgaben:**

1.  Erstelle eine neue Testdatei im `e2e/`-Verzeichnis, z.B. `navigation.spec.ts`.
2.  Schreibe einen Testfall (`test(...)`), der die folgenden Schritte ausführt:
    -   Öffne die Startseite der Feed App (`/`). Verwende die `baseURL` aus der `playwright.config.ts` (stelle sicher, dass sie dort auf `http://localhost:3000` gesetzt ist).
    -   Prüfe, ob die Hauptüberschrift "Playwright Demo App" sichtbar ist (z.B. mit `page.getByTestId('hero-title-2')`).
    -   Finde den Button "View Public News" (z.B. über `page.getByTestId('link-public-news')`).
    -   Klicke auf den Button.
    -   Prüfe mithilfe einer Assertion (`expect`), ob die Seite zur Public News Seite (`/news/public`) navigiert hat (z.B. `expect(page).toHaveURL('/news/public')`).
    -   Prüfe zusätzlich, ob die Überschrift "News Feed" auf der neuen Seite sichtbar ist (z.B. `page.getByRole('heading', { name: 'News Feed' })`).
3.  Führe den Test in allen konfigurierten Browsern aus:
    -   `npx playwright test`

**Zeit:** 20 Minuten

---

> **Tipp:** Nutze `page.goto()`, `page.getByTestId()`, `locator.click()`, `expect(page).toHaveURL()` und `expect(locator).toBeVisible()`. Vergiss nicht, die `baseURL` in `playwright.config.ts` zu setzen!
