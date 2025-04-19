# Übung 3C – Eigene Fixtures erstellen (Pseudocode/Leitfaden)

**Ziel:**
Du erstellst eigene Playwright-Fixtures für die Next.js Feed App, um wiederkehrende Setup-Schritte zu kapseln und deine Tests lesbarer und wartbarer zu machen. Dabei lernst du die verschiedenen Fixture-Scopes und deren Anwendungsfälle kennen.

**Aufgaben:**

1. **Projektstruktur vorbereiten:**
   - Erstelle einen Ordner `e2e/fixtures`
   - Lege die Dateien an:
     - `e2e/fixtures/feed-fixtures.ts` (Hauptfixtures)
     - `e2e/fixtures/types.ts` (Typdefinitionen)
     - `e2e/tests/feed-fixtures.spec.ts` (Tests)

2. **Fixture-Typen definieren (`types.ts`):**
   - Definiere Interfaces für Feeds und die zu verwendenden Fixtures (siehe Beispiel unten).
   - Beispiel:
     ```typescript
     // ...siehe oben für Interface-Definitionen...
     ```

3. **Fixtures implementieren (`feed-fixtures.ts`):**
   - Erweitere den Playwright-Test mit eigenen Fixtures.
   - Implementiere Test-scoped und Worker-scoped Fixtures für verschiedene Anwendungsfälle.
   - Kapsle wiederkehrende Setups (z.B. Navigation, API-Client mit Auth, Testdaten).
   - Beispielstruktur:
     ```typescript
     // ...base.extend<FeedFixtures>({ ... })
     // siehe oben für Details...
     ```

4. **Tests implementieren (`feed-fixtures.spec.ts`):**
   - Schreibe Tests, die die eigenen Fixtures nutzen.
   - Teste verschiedene Anwendungsfälle (z.B. UI-Tests mit publicFeeds/privateFeeds, API-Tests mit feedApi, kombinierte Tests).
   - Beispielstruktur:
     ```typescript
     // ...test.describe(...)
     // siehe oben für Testbeispiele...
     ```

**Vorteile dieser Implementierung:**
- Klare Trennung von Fixtures und Tests
- Wiederverwendbare Komponenten
- Test- und Worker-scoped Fixtures für verschiedene Anwendungsfälle
- Automatisches Cleanup nach Tests
- Typsicherheit durch TypeScript
- Effiziente Ressourcennutzung durch Worker-Fixtures

**Zeit:** 40 Minuten

---

> **Tipp:** Überlege, wann du Test-scoped und wann Worker-scoped Fixtures einsetzen solltest. Nutze `test.describe.configure({ mode: 'serial' })` nur, wenn wirklich nötig.