# Übung 16b – CI lokal simulieren

**Ziel:** Du lässt deine Tests wie in einer Pipeline laufen und baust ein lokales Quality Gate, ohne GitHub oder CI-Server.
**Zeit:** 45 Min. (Pflicht: Aufgaben 1 bis 5) · Bonus: +25 Min. (Aufgaben 6 und 7, Vorlage) · **Startbranch:** `git switch ex/16b-ci-lokal` · **Datei:** Config und `package.json`, Hilfsdatei `e2e/flaky.spec.ts`

> Roter Faden: Baut auf deiner Suite aus den Übungen 1 bis 16 auf. Aufgaben 1 bis 5 laufen mit `e2e/example.spec.ts` (und für Aufgabe 4 zusätzlich `e2e/01-setup.spec.ts`), Aufgaben 6 und 7 brauchen ein Git-Repo mit Branch `main` und deine Page Objects aus Übung 9 · Du gibst weiter: ein `ci`-Script, das du in jedes CI-System übernehmen kannst (Vorlagen in `exercises/ci-templates/`) · Zurückgefallen? `git switch ex/16b-ci-lokal` (Startbranch enthält die Lösungen aller früheren Übungen, nicht die von Übung 16b). Musterlösung: `git diff ex/16b-ci-lokal ex/17-capstone`.

## Vorbereitung: Begriffe
- **Pipeline:** Eine Shell, die auf einem Server deine Befehle ausführt. Sie setzt die Umgebungsvariable `CI`.
- **Quality Gate:** Eine Sperre, die schlechten Code nicht durchlässt, z. B. ein roter Test blockiert den Push.
- **`forbidOnly`:** Config-Option. Ist sie an, bricht der Lauf ab, wenn ein `test.only` im Code steht.
- **Flaky:** Ein Test, der mal grün und mal rot ist. Playwright meldet `flaky`, wenn er erst im Retry besteht.
- **Sharding:** Die Test-Suite wird in Teile (Shards) geteilt, die auf getrennten Maschinen laufen.
- **Blob-Report:** Zwischenformat eines Shards. `merge-reports` führt mehrere Blob-Reports zu einem Report zusammen.

## Aufgaben

### Aufgabe 1 – Wie CI laufen lassen
Starte `CI=1 npx playwright test e2e/example.spec.ts --project=chromium` (Windows PowerShell: `$env:CI=1; npx playwright test …`). Öffne `playwright.config.ts` und suche, was `CI` ändert. Setze dann ein `test.only` in `example.spec.ts` und starte erneut. Starte zuletzt `npm run dev` in einem zweiten Terminal und danach den CI-Lauf.
**Fertig, wenn:** du für `workers`, `retries`, `forbidOnly` und `webServer.reuseExistingServer` sagen kannst, wie sie sich mit `CI` ändern, und die beiden Fehlschläge (`test.only`, belegter Port) gesehen hast. Entferne `test.only` danach wieder und beende den Dev-Server.
<details><summary>Erwartete Antworten</summary>

- `workers`: 1 statt automatisch (Tests laufen nacheinander, stabiler auf kleinen Runnern).
- `retries`: 2 statt 0 (fehlgeschlagene Tests werden wiederholt).
- `forbidOnly`: an. Der Lauf bricht mit einem Fehler ab, weil ein vergessenes `test.only` sonst fast alle Tests still überspringt.
- `reuseExistingServer`: aus. Die Config startet immer einen eigenen Server. Läuft schon einer auf Port 3000, scheitert der Start. Eine Pipeline hat keinen Server vom Vortag.
</details>

### Aufgabe 2 – Flaky Tests erkennen
Lege `e2e/flaky.spec.ts` an mit einem Test, der **nur im Retry** besteht: Er öffnet `/` und fordert `testInfo.retry` größer als 0. Starte ihn mit `CI=1` (nur diese Datei, Projekt chromium). Öffne den Trace aus `test-results/…-retry1/trace.zip`. Starte den Lauf dann mit `--fail-on-flaky-tests`.
**Fertig, wenn:** der erste Lauf grün ist und `1 flaky` meldet, der zweite Lauf rot ist. Lösche die Datei danach (ohne `CI` ist der Test immer rot).
<details><summary>Tipp</summary>

Der Test-Callback bekommt `testInfo` als zweiten Parameter: `async ({ page }, testInfo) => …`. Den Trace öffnest du mit `npx playwright show-trace <pfad>`. Er entsteht wegen `trace: 'on-first-retry'` in der Config.
</details>
<details><summary>Erwartete Antwort: Wann `--fail-on-flaky-tests`?</summary>

Wenn dein Team flaky Tests nicht tolerieren will, z. B. auf `main` oder vor einem Release. Auf Feature-Branches reicht oft die Warnung `flaky`, sonst blockieren einzelne Aussetzer jeden Merge.
</details>

### Aufgabe 3 – Reporter für CI-Systeme
Ersetze in `playwright.config.ts` die Zeile `reporter: 'html',` so, dass mit `CI` die Reporter `list`, `junit` (Datei `results/junit.xml`) und `html` (mit `open: 'never'`) laufen, ohne `CI` bleibt es `'html'`. Trage `/results/` in die `.gitignore` ein.
**Fertig, wenn:** nach `CI=1 npx playwright test e2e/example.spec.ts --project=chromium` die Datei `results/junit.xml` existiert und sich kein Browser mit dem Report öffnet.
<details><summary>Tipp</summary>

`reporter` akzeptiert eine Liste von `[name, optionen]`-Paaren, z. B. `['junit', { outputFile: … }]`. Wähle mit `process.env.CI ? … : …`.
</details>
<details><summary>Erwartete Antwort: Warum JUnit und `open: 'never'`?</summary>

JUnit-XML lesen GitLab, Jenkins und Azure DevOps ein, um Testergebnisse anzuzeigen. `open: 'never'` verhindert, dass der HTML-Report einen Browser öffnet, in einer Pipeline sitzt niemand davor.
</details>

### Aufgabe 4 – Sharding und Reports zusammenführen
Teile den Lauf in 2 Shards: `npx playwright test e2e/01-setup.spec.ts e2e/example.spec.ts --project=chromium --shard=1/2 --reporter=blob`, danach `--shard=2/2`. Mit nur einer Spec-Datei hätte ein Shard nichts zu tun. Jeder Lauf leert `blob-report/`: Verschiebe die Dateien nach jedem Lauf in einen Ordner `all-blob-reports/`. Führe sie mit `npx playwright merge-reports --reporter=html ./all-blob-reports` zusammen und öffne den Report mit `npx playwright show-report`.
**Fertig, wenn:** der zusammengeführte Report alle 4 Tests (3 aus `01-setup`, 1 aus `example`) zeigt (die Auth-Setup-Tests aus Übung 7 erscheinen zusätzlich, weil jeder Shard sie als Abhängigkeit mitlaufen lässt). Die Shards laufen nacheinander, sonst konkurrieren sie um Port 3000.
<details><summary>Tipp</summary>

`mkdir all-blob-reports`, dann nach jedem Lauf `mv blob-report/* all-blob-reports/`. In einer echten Pipeline laufen die Shards parallel als Matrix-Jobs, ein Merge-Job lädt alle Blob-Reports herunter und führt sie zusammen.
</details>

### Aufgabe 5 – Die Pipeline als npm-Script
Ergänze in `package.json` unter `scripts` ein Script `ci`, das `playwright test --project=chromium` ausführt.
**Fertig, wenn:** `npm run ci -- e2e/example.spec.ts` grün ist. Schau dir danach an, wie die Vorlagen in `exercises/ci-templates/` genau diesen Befehl aufrufen.
<details><summary>Erwartete Antwort: Warum ein Script?</summary>

Das CI-System braucht nur noch `npm run ci`. Was genau läuft (Projekt, Optionen), steht im Repo und lässt sich lokal prüfen.
</details>

## Bonus (optional)

Für A und B brauchst du ein Git-Repo mit Branch `main` und Page Objects aus Übung 9 (`e2e/pages/…`). Ohne `.git`-Ordner (z. B. ZIP): `git init && git add -A && git commit -m start && git branch -M main`.

### Bonus A – Nur betroffene Tests (`--only-changed`)
Wechsle in einen Branch (`git switch -c feature/suche`), ändere ein Page Object und committe. Liste mit `npx playwright test --project=chromium --list --only-changed=main` die betroffenen Tests. Ändere danach nur App-Code (z. B. `components/news/FeedList.tsx`).
**Fertig, wenn:** im ersten Fall nur Specs erscheinen, die das Page Object importieren, im zweiten Fall keiner.
<details><summary>Erwartete Antwort</summary>

`--only-changed` kennt nur die Imports der Tests, nicht die App. Es taugt für schnelles Feedback im Branch, ein vollständiger Lauf gehört auf `main`.
</details>

### Bonus B – Lokaler Quality Gate beim Push
Lege ein lokales Bare-Repo als „Server" an (`git init --bare ../ci-remote.git`, `git remote add ci ../ci-remote.git`). Schreibe `.githooks/pre-push`, der `npx playwright test --project=chromium --only-changed=main` ausführt, mache ihn ausführbar (`chmod +x`, unter Windows nicht nötig) und aktiviere ihn mit `git config core.hooksPath .githooks`.
**Fertig, wenn:** `git push ci feature/suche` mit einem absichtlich roten Test abgebrochen wird und nach der Reparatur durchgeht.
<details><summary>Erwartete Antwort: Reine App-Änderung?</summary>

Es läuft kein Test, der Push geht durch. Das ist eine Lücke (siehe Bonus A). Hooks lassen sich außerdem mit `git push --no-verify` umgehen. Ein lokales Gate ersetzt deshalb keine echte Pipeline.
</details>

### Bonus C – CI-Vorlage anpassen
Passe die Vorlage aus `exercises/ci-templates/` für das CI-System in deinem Unternehmen an (GitHub Actions, GitLab, Azure DevOps oder Jenkins). Pinne das Docker-Image passend zur Playwright-Version (`mcr.microsoft.com/playwright:v1.64.0-noble`).
**Fertig, wenn:** die Vorlage `npm run ci` aufruft und der Image-Tag zu deiner Playwright-Version passt.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/16b-ci-lokal ex/17-capstone` · oder `git switch ex/17-capstone`.
