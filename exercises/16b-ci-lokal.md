# Übung 16b – CI lokal simulieren

**Ziel:**
Du erlebst, was sich ändert, wenn Tests in einer Pipeline laufen, und baust einen lokalen Quality Gate. Dafür brauchst du **keinen** GitHub- oder CI-Server-Zugang: Eine Pipeline ist im Kern eine Shell, die Umgebungsvariable `CI` und ein paar Dateien, die aufbewahrt werden.

> **🧵 Roter Faden**
> **Baut auf:** deiner Suite aus den Übungen 1–16 – jede Aufgabe läuft mit den Tests, die du schon hast.
> **Du gibst weiter:** ein `ci`-Script und einen pre-push-Hook, die du 1:1 in jedes CI-System übernehmen kannst (Vorlagen in `exercises/ci-templates/`).
> **Zurückgefallen?** Es reicht der mitgelieferte Smoke-Test `e2e/example.spec.ts`.

**Aufgaben:**

1. **Wie CI laufen lassen:**

   ```bash
   # macOS / Linux
   CI=1 npx playwright test --project=chromium
   # Windows PowerShell
   $env:CI=1; npx playwright test --project=chromium
   ```

   - [ ] Vergleiche mit `playwright.config.ts`: Was ändert `CI` bei `workers`, `retries`, `forbidOnly` und `webServer.reuseExistingServer`?
   - [ ] Setze in einen Test `test.only(...)` und starte den CI-Lauf erneut. Warum ist der Abbruch gewollt?
   - [ ] Starte parallel `npm run dev` und dann den CI-Lauf. Warum scheitert er am Port?

2. **Flaky Tests erkennen** – lege `e2e/flaky.spec.ts` an:

   ```typescript
   import { test, expect } from '@playwright/test';

   // Scheitert beim ersten Versuch und besteht im Retry: verlässlich "flaky"
   test('simulierter flaky Test', async ({ page }, testInfo) => {
     await page.goto('/');
     expect(testInfo.retry).toBeGreaterThan(0);
   });
   ```

   - [ ] Mit `CI=1` ist der Lauf grün, die Ausgabe meldet aber `1 flaky`.
   - [ ] Unter `test-results/…-retry1/` liegt ein `trace.zip` (wegen `trace: 'on-first-retry'`). Öffne ihn mit `npx playwright show-trace`.
   - [ ] Mit `--fail-on-flaky-tests` wird derselbe Lauf rot. Wann willst du das in einer Pipeline?
   - [ ] Lösche die Datei danach wieder (ohne `CI` ist der Test immer rot).

3. **Reporter für CI-Systeme** – ersetze in `playwright.config.ts` die Zeile `reporter: 'html',`:

   ```typescript
   reporter: process.env.CI
     ? [['list'], ['junit', { outputFile: 'results/junit.xml' }], ['html', { open: 'never' }]]
     : 'html',
   ```

   - [ ] Nach einem CI-Lauf liegt `results/junit.xml` vor. Dieses Format lesen GitLab, Jenkins und Azure DevOps ein.
   - [ ] Es öffnet sich kein Browser: In einer Pipeline sitzt niemand davor.
   - [ ] Trage `/results/` in die `.gitignore` ein.

4. **Sharding und Reports zusammenführen:**

   ```bash
   npx playwright test --project=chromium --shard=1/2 --reporter=blob
   mkdir all-blob-reports
   mv blob-report/* all-blob-reports/

   npx playwright test --project=chromium --shard=2/2 --reporter=blob
   mv blob-report/* all-blob-reports/

   npx playwright merge-reports --reporter=html ./all-blob-reports
   npx playwright show-report
   ```

   - [ ] Jeder Lauf leert `blob-report/`. Deshalb sammelst du die Dateien in einem eigenen Ordner, genau wie eine Pipeline die Artefakte aller Shards herunterlädt.
   - [ ] Die Shards laufen **nacheinander**, sonst konkurrieren sie um Port 3000.
   - [ ] Der zusammengeführte Report enthält alle Tests.

5. **Die Pipeline als npm-Script** – ergänze in `package.json`:

   ```json
   "ci": "playwright test --project=chromium"
   ```

   - [ ] `npm run ci` ist der einzige Befehl, den ein CI-System aufrufen muss. Schau dir an, wie die Vorlagen in `exercises/ci-templates/` genau diesen Befehl einbetten.

6. **Nur betroffene Tests laufen lassen (Git):**

   ```bash
   git switch -c feature/suche
   # ändere eines deiner Page Objects aus Übung 9, dann committen
   npx playwright test --project=chromium --list --only-changed=main
   ```

   - [ ] Es erscheinen nur die Specs, die das geänderte Page Object importieren.
   - [ ] Ändere stattdessen nur App-Code (z. B. `components/news/FeedList.tsx`): Jetzt findet `--only-changed` **keinen** Test. Es kennt nur die Imports der Tests, nicht die App. Deshalb: schnelles Feedback im Branch, vollständiger Lauf auf `main`.

   > **Kein `.git`-Ordner?** (z. B. Repo als ZIP erhalten) `git init && git add -A && git commit -m start && git branch -M main`

7. **Lokaler Quality Gate beim Push** – ein lokales Bare-Repo übernimmt die Rolle des Servers:

   ```bash
   git init --bare ../ci-remote.git
   git remote add ci ../ci-remote.git
   mkdir .githooks
   ```

   `.githooks/pre-push`:

   ```sh
   #!/bin/sh
   npx playwright test --project=chromium --only-changed=main
   ```

   ```bash
   chmod +x .githooks/pre-push   # unter Windows nicht nötig
   git config core.hooksPath .githooks
   ```

   - [ ] Mach einen Test absichtlich rot, committe und führe `git push ci feature/suche` aus: Der Push wird abgebrochen.
   - [ ] Repariere den Test, committe erneut: Der Push geht durch.
   - [ ] Pushe eine reine App-Änderung: Es läuft kein Test, der Push geht durch. Ist das ein Problem? (Tipp: Aufgabe 6)

**Bonus:** Passe die Vorlage aus `exercises/ci-templates/` für das CI-System in deinem Unternehmen an (GitHub Actions, GitLab, Azure DevOps oder Jenkins).

**Was du lernst:**

- Was `CI` in der Config umschaltet: Worker, Retries, `forbidOnly`, Server-Start
- Flaky Tests erkennen und bewusst entscheiden, ob sie die Pipeline brechen
- JUnit- und HTML-Report für CI-Systeme, Sharding mit `blob` + `merge-reports`
- `--only-changed` als schnelles Feedback und seine Grenzen
- Ein Quality Gate, das ohne CI-Server funktioniert

**Zeit:** 60 Minuten

---

> **Tipp:** Hooks lassen sich mit `git push --no-verify` umgehen. Ein lokaler Gate ersetzt deshalb keine echte Pipeline, er fängt aber die meisten Fehler ab, bevor sie jemand anderes sieht.
