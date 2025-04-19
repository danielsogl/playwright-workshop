# Übung 0 – Projekt-Setup

**Ziel:**
Du richtest ein Playwright-Testprojekt für die Next.js Feed Demo App ein und prüfst, ob die Testumgebung funktioniert.

**Aufgaben:**

1.  **Stelle sicher, dass du im Projektverzeichnis `playwright-workshop` bist.**
2.  **Installiere alle Abhängigkeiten:**
    - `npm install`
    - `npx playwright install`
3.  **Starte die Anwendung lokal:**
    - `npm run dev`
    - Die App läuft auf [http://localhost:3000](http://localhost:3000)
4.  **(Falls noch nicht geschehen) Initialisiere ein Playwright-Projekt im Ordner `e2e/`:**
    - `npx playwright test --init`
    - Wähle TypeScript
    - Wähle `e2e` als Testordner
    - Füge einen GitHub Actions Workflow hinzu (optional)
    - Installiere die Browser, falls gefragt
5.  **Führe einen Beispieltest gegen die lokale App aus:**
    - Erstelle einen Test (z.B. in `e2e/home.spec.ts`), der die Startseite (`/`) öffnet und prüft, ob die Überschrift "Welcome to the Playwright Demo App" sichtbar ist.
6.  **Sieh dir die generierte Projektstruktur und die wichtigsten Konfigurationsdateien an (`playwright.config.ts`, `e2e/`).**

**Zeit:** 15 Minuten

---

> **Tipp:** Siehe [Cheat-Sheet: Projekt-Setup](./cheat-sheets/projekt-setup.md)
