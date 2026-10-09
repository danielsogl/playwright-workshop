# Übung 18 – KI-gestütztes Testen: Agents, Seed, Planner, Generator, Healer

**Ziel:** Du richtest das offizielle Playwright-KI-Setup ein und lässt dir einen Test planen, generieren und heilen. Dabei erkennst du, wo die KI hilft und wo dein Testing-Know-how gebraucht wird.
**Zeit:** 50 Min. (Kern: Aufgaben 1–4) · Bonus: +20 Min. · **Startbranch:** `git switch ex/18-ai-assisted` · **Dateien:** `e2e/seed.spec.ts`, `specs/*.md`, `e2e/news-search.spec.ts` (frei benennbar)

> Roter Faden: Baut auf der App auf, die du von Hand getestet hast. Genau deshalb erkennst du, ob ein generierter Test gut ist. · Du gibst weiter: ein Repo, in dem ein Coding Agent Playwright bedienen kann. · Zurückgefallen? `git switch ex/18-ai-assisted` (Startbranch: enthält die Lösungen der Übungen 1–17, aber noch kein KI-Setup). Die Lösung der Übung (Agent-Dateien, `.mcp.json`, Seed) zeigt `git diff ex/18-ai-assisted ex/end`. Du brauchst keine früheren Übungen, nur die laufende App.

## Begriffe in Kürze

- **Agent:** vordefinierte Rolle für einen KI-Client (Datei mit Anweisungen und erlaubten Tools), hier Planner, Generator, Healer.
- **Skill:** Anleitungsdatei (`SKILL.md`), die ein Agent bei Bedarf liest, z. B. wie man das Playwright-CLI bedient.
- **MCP** (Model Context Protocol): Schnittstelle, über die ein KI-Client Tools wie „Browser klicken“ aufruft.
- **Seed-Test:** kleiner Test, der festlegt, wie ein generierter Test startet (Start-URL, Fixtures, Login). Jeder generierte Test erbt ihn.
- **Healer:** Agent, der fehlschlagende Tests ausführt, analysiert und repariert.

## Vorbereitung

- Playwright ≥ 1.56 (`npx playwright --version`), App läuft (`npm run dev`) oder startet über `webServer`; `.env` mit `RSS_OFFLINE_MODE=true` (Übung 1).
- Du brauchst einen KI-Client. Die Anleitung unten nutzt **Claude Code** (`--loop=claude`). Alternativen laut `npx playwright init-agents --help`: `--loop=copilot` bzw. `vscode` (VS Code mit Copilot), `codex`, `opencode`. Der Ablauf ist gleich, nur die Dateien landen woanders (z. B. `.github/agents/`).
- KI ist nicht deterministisch: Formulierungen, Plan und Test sehen bei dir anders aus als beim Nachbarn. „Gut genug“ ist bei jedem Schritt unten beschrieben.

## Aufgaben (Kern)

### Aufgabe 1 – Agents einrichten
Führe im Repo-Root aus:

```bash
npx playwright init-agents --loop=claude
```

Schau dir an, was entstanden ist: die drei Agent-Dateien (`.claude/agents/playwright-test-*.md`), `.mcp.json` und der Seed-Test. Öffne `playwright-test-planner.md` und lies die Zeile `tools:`.

**Fertig, wenn:** Drei Agent-Dateien (planner, generator, healer), `.mcp.json` mit dem Server `playwright-test` und `e2e/seed.spec.ts` existieren. Du kannst beantworten, warum der Planner keine Dateien frei schreiben darf (nur über `planner_save_plan`).

<details><summary>Tipp</summary>
`init-agents` überschreibt eine bestehende `.mcp.json`: prüfe nach dem Lauf `git diff`. Nach jedem Playwright-Update erneut ausführen. Wo der Seed landet, steuern `--project`/`--config`.
</details>

### Aufgabe 2 – Seed-Test schreiben
`init-agents` legt `e2e/seed.spec.ts` nur als leeres Skelett an (ein Test ohne Inhalt, Kommentar „generate code here“). Öffne die Datei und schreibe den Seed selbst: Er lädt die Startseite `/` und prüft den Seitentitel (er enthält „Playwright Demo“).

**Fertig, wenn:** `npx playwright test e2e/seed.spec.ts --project=chromium` ist grün und der Seed prüft den Seitentitel (`/Playwright Demo/`).

<details><summary>Tipp</summary>
Playwright findet den Seed am Dateinamen (`*seed*`) im `testDir` (`e2e/`). Für Flows, die Login brauchen, würdest du hier die `authenticatedPage`-Fixture aus Übung 8 importieren. Ein schlechter Seed ist teuer: jeder generierte Test erbt ihn.
</details>

### Aufgabe 3 – Planner: Testplan erzeugen und reviewen
Starte Claude Code im Repo-Root und gib diesen Prompt:

> Nutze den **playwright-test-planner**, um Tests für die News-Suche auf `/news/public` zu planen.

Öffne den Plan in `specs/`. Reviewe ihn wie einen Pull Request: Sind die Szenarien unabhängig voneinander? Fehlt der Negativfall (Suche ohne Treffer)? Beschreibt ein Szenario Implementierung statt Verhalten? Korrigiere den Plan direkt im Markdown.

**Fertig, wenn:** Es gibt eine Plan-Datei `specs/*.md` mit nummerierten Szenarien (z. B. 1.1, 1.2), mindestens einem Treffer-Szenario und einem Szenario ohne Treffer. Fehlt eines, hast du es selbst ergänzt.

<details><summary>Tipp</summary>
Der Planner kann ein paar Minuten explorieren und fragt eventuell Rechte für Tools ab. Bestätige nur Tools von `playwright-test`. Ein anderer Plan als beim Nachbarn ist normal.
</details>

### Aufgabe 4 – Generator: Plan zum Test
Prompt:

> Nutze den **playwright-test-generator** für Szenario 1.1 aus `specs/<dein-plan>.md`.

Referenziere das Szenario per **Nummer**, nicht per Name. Der Generator prüft Locators live gegen die App. Reviewe den erzeugten Test: Nutzt er `getByRole`/`getByLabel` statt CSS oder Test-IDs? Prüfen die Assertions echtes Verhalten (Anzahl, Text) oder nur `toBeVisible()`?

**Fertig, wenn:** Ein neuer Test liegt in `e2e/` (z. B. `e2e/news-search.spec.ts`) und `npx playwright test <Datei> --project=chromium` ist grün. Mindestens eine schwache Stelle hast du benannt und verbessert (Locator oder Assertion).

## Bonus (optional, zählt nicht zur Zeit)

### Bonus A – Healer: Locator kaputt, App kaputt
1. Ändere im generierten Test einen Locator absichtlich falsch (z. B. `'Search news articles'` → `'Suche'`). Prompt: *Nutze den **playwright-test-healer**, um die fehlschlagenden Tests in `e2e/` zu reparieren.* Erwartung: Der Healer korrigiert den Locator, Test wird grün.
2. Mach den Test wieder heil und ändere stattdessen in der **App** (`app/news/public/page.tsx`) das `aria-label` des Suchfelds. Erwartung: Der Healer soll den Test **nicht** an die Änderung anpassen, sondern skippen oder den App-Bug melden. Ein Healer, der echte App-Fehler wegpatcht, macht den Test wertlos. Nimm die App-Änderung danach zurück (`git restore app/`).

Gut genug: Du hast beide Fälle beobachtet und kannst erklären, warum der zweite nicht „geheilt“ werden darf. Verhält sich die KI anders, ist das ebenfalls ein Ergebnis.

### Bonus B – CLI und Skills (token-sparsam)
Für Agents mit Terminal-Zugriff: `npx playwright cli open http://localhost:3000/news/public`, dann `snapshot`, `find "Search news"`, `close`. Der Zustand liegt auf der Disk statt im KI-Kontext. Die Skills dazu liegen in `.agents/skills/playwright-cli/SKILL.md` (nach `init-skills`: `npx playwright init-skills --loop=claude`). Faustregel: Agent hat Bash → CLI + Skills; kein Terminal → MCP.

### Bonus C – MCP interaktiv und Trace-Analyse
Der Server `playwright` (`npx playwright mcp`) gibt deinem Client Browser-Tools für eigene Prompts. `init-agents` trägt ihn nicht ein: Ergänze in `.mcp.json` einen zweiten Eintrag (`command: npx`, `args: ["playwright", "mcp", "--browser=chromium"]`), siehe `git show ex/end:.mcp.json`. Zum Absichern: `--allowed-hosts` begrenzt die Hosts, über die der Server selbst erreichbar ist (kommagetrennt); `--allowed-origins` begrenzt, welche Origins der Browser anfragen darf (Semikolon-getrennt). Trace analysieren: `npx playwright trace open <trace.zip>`, `trace errors`, `trace actions`.

### Bonus D – Capstone planen lassen
Lass den Planner den Flow aus Übung 17 planen und vergleiche den Plan mit `e2e/17-capstone.spec.ts`. Was hat die KI übersehen?

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/18-ai-assisted ex/end` · oder `git switch ex/end` (Agent-Dateien, `.mcp.json` und `e2e/seed.spec.ts` liegen dort fertig).

> Hinweis: Generierte Tests sind normale `*.spec.ts` und laufen in jeder CI. Die Agents selbst gehören nicht in die Pipeline. Den Healer nie automatisch auf `main` pushen lassen: Fixes gehen als PR zu einem Menschen.
