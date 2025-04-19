# Übung 6A – Responsive Design Testing (Feed App)

**Ziel:**
Du implementierst umfassende, benutzerzentrierte Tests für das responsive Design der Next.js Feed App mit Playwright Device Emulation und Visual Testing. Die Tests sind nach Features/Komponenten strukturiert und nutzen Page Objects.

**Aufgaben:**

1. **Test-Projekt Setup:**
   - Passe `playwright.config.ts` an:
     - Setze `testDir: './e2e'`.
     - Definiere Projekte für Desktop, Tablet und Mobile mit Playwrights `devices`.
     - Setze `baseURL` und nutze empfohlene `use`-Optionen (z.B. Trace, Video, Screenshot on failure).

2. **Page Object Model für die Navigation:**
   - Lege in `e2e/utils/Navigation.po.ts` eine Klasse `Navigation` an.
   - Kapsle Methoden wie `openMenu()`, `isDesktopNavVisible()`, `isMobileMenuVisible()`.
   - Nutze ausschließlich semantische Selektoren (`getByRole`, `getByLabel`, `getByText`).

3. **Responsive Layout Tests:**
   - Lege die Tests in `e2e/navigation/responsive.spec.ts` ab.
   - Verwende das Navigation-Page-Object in den Tests.
   - Schreibe einen Test für die Desktop-Ansicht: Prüfe, ob die Desktop-Navigation sichtbar ist und der Mobile-Menü-Toggle nicht sichtbar.
   - Schreibe einen Test für die Mobile-Ansicht: Prüfe, ob die Desktop-Navigation nicht sichtbar ist und der Mobile-Menü-Toggle sichtbar ist. Klicke optional den Toggle und prüfe, ob das Menü erscheint.

4. **News Grid Layout und Visual Testing:**
   - Lege die Tests in `e2e/news/news-grid-visual.spec.ts` ab.
   - Schreibe einen Test, der das Grid auf `/news/public` prüft und einen Screenshot für den visuellen Vergleich erstellt (`toHaveScreenshot`).

5. **Touch-Interaktionen testen:**
   - Lege die Tests in `e2e/navigation/mobile-interactions.spec.ts` ab.
   - Simuliere Touch-Interaktionen (z.B. Menü öffnen, Pull-to-Refresh) und prüfe das Verhalten.

6. **Visual Regression Tests für Komponenten:**
   - Lege die Tests in `e2e/visual/visual.spec.ts` ab.
   - Erstelle Screenshots für ganze Seiten und einzelne Komponenten (z.B. Navigation, Footer) und vergleiche sie mit Baseline-Screenshots.

**Best Practices:**
- Gruppiere Tests nach Feature/Komponente im `e2e/<domain>/`-Verzeichnis.
- Verwende Page Objects für wiederkehrende UI-Interaktionen.
- Nutze ausschließlich semantische Selektoren.
- Halte Tests unabhängig und stateless.
- Verwende `toHaveScreenshot()` für visuelle Vergleiche.

**Zeit:** 45 Minuten

---

> **Tipp:** Verwende `npx playwright test --update-snapshots` um Basis-Screenshots zu erstellen oder zu aktualisieren. Nutze die UI-Mode (`npx playwright test --ui`) für die visuelle Inspektion der Screenshots und Debugging von Layout-Problemen.
