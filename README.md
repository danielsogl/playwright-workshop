# Playwright Workshop – Demo-App

Next.js Feed-App, die als Testobjekt für den 3-tägigen Playwright-Workshop dient.
Die App zeigt öffentliche und private News-Feeds, Login/Auth, Einstellungen und
weitere Seiten, gegen die die Übungen geschrieben werden.

## Voraussetzungen

- **Node.js 22.x, 24.x oder 26.x**
- npm (im Repo enthaltenes `package-lock.json` wird genutzt)

## Setup

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Playwright-Browser installieren (mindestens Chromium)
npx playwright install

# 3. Umgebungsvariablen anlegen
cp .env.example .env
```

Die `.env` enthält:

- `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` – Zugangsdaten des Test-Users, die von den Tests gelesen werden
- `RSS_OFFLINE_MODE=true` – nutzt statische Feed-Daten (kein Live-Fetch, WLAN-unabhängig)
- `AUTH_SECRET` – Secret für Auth.js

**Test-User:** `test@example.com` / `password`

## App starten

```bash
npm run dev
```

Läuft auf <http://localhost:3000>. Playwright startet den Dev-Server über den
`webServer`-Block in `playwright.config.ts` bei Bedarf automatisch.

## Tests ausführen

```bash
npm run e2e          # alle Tests (headless)
npm run e2e:ui       # interaktiver UI-Mode
npm run e2e:debug    # Playwright Inspector
npm run e2e:report   # letzten HTML-Report öffnen
```

Der mitgelieferte Smoke-Test `e2e/example.spec.ts` prüft, ob die App erreichbar
ist – ein grüner Startpunkt nach dem Setup.

## Checkpoints (Branches `ex/*`)

Die Musterlösungen liegen nicht als Ordner im Repo, sondern als **lineare Kette
von Branches**. `ex/NN-slug` ist der **Startpunkt** von Übung NN und enthält die
Musterlösungen aller vorherigen Übungen. Die Lösung von Übung NN steckt im
Folgebranch:

```bash
git switch ex/05-suche                       # Startpunkt Übung 5 (Lösungen 1–4 sind da)
git diff ex/05-suche ex/06-accessibility     # Musterlösung von Übung 5
git switch ex/end                            # alle Lösungen
```

`main` entspricht `ex/01-setup` (nur App, Handouts und ein Smoke-Test). Die
Reihenfolge der Branches ist die Reihenfolge der Dateien in `exercises/`; die
Config wächst mit (Auth-Setup-Projekt ab Übung 7, KI-Agents ab Übung 18).

### Kette pflegen

Die Kette ist **eine** lineare Historie mit einem Commit pro Musterlösung
(`ex(05): …`); die Branches sind nur Zeiger darauf. Änderungen an einer früheren
Übung machst du mit `git rebase -i` auf dem Quell-Branch `checkpoints` und
setzt danach die Zeiger neu:

```bash
scripts/sync-checkpoints.sh            # setzt ex/* anhand der ex(NN)-Commits von `checkpoints`
git push --force-with-lease origin 'refs/heads/ex/*' main
```

Die CI (`.github/workflows/playwright.yml`) prüft jeden `ex/*`-Branch (ESLint,
Tests in Chromium) und dass die Kette linear ist.

## Projektstruktur

```
exercises/    Übungsaufgaben (01 … 18 plus 06b/16b, durchnummeriert wie im Foliensatz) – das, was die Teilnehmer umsetzen
  ci-templates/  Pipeline-Vorlagen (GitHub Actions, GitLab, Azure DevOps, Jenkins) zu Übung 16b
e2e/          Verzeichnis für die Tests der Teilnehmer; auf den ex/*-Branches liegen hier die Musterlösungen (plus pages/, fixtures/, mocks/)
scripts/      sync-checkpoints.sh – setzt die ex/*-Branches
app/          Next.js App (news, auth, settings, clock, file-download, …)
components/   UI-Komponenten
config/       Seed-Daten & Site-Konfiguration
.agents/      Playwright Agent Skills (playwright-cli, playwright-trace, …)
.claude/      Skill-Symlinks (skills/); ab ex/18 auch agents/
```

## KI-gestütztes Testen (Übung 18)

Ab dem Branch `ex/18-ai-assisted` ist das Repo für Coding Agents vorbereitet –
Agents, Skills und MCP-Server sind eingerichtet und committet:

```bash
.claude/agents/   playwright-test-planner | -generator | -healer
.claude/skills/   Symlinks auf .agents/skills/ (playwright-cli, playwright-trace, …)
.mcp.json         playwright-test (Agents) · playwright (interaktiv) · context7
e2e/seed.spec.ts  Startpunkt, den der Planner ausführt und der Generator als Vorlage nutzt
specs/            Markdown-Testpläne
```

Neu erzeugen (z.B. nach einem Playwright-Update, die Definitionen sind an die
Version gebunden):

```bash
npx playwright init-agents --loop=claude   # claude | codex | copilot | opencode | vscode
npx playwright init-skills --loop=claude   # claude | agents
```

> `init-agents` überschreibt eine vorhandene `.mcp.json` – danach den Diff prüfen,
> bevor du committest.

Terminal-Werkzeuge (ab v1.62 in Playwright gebündelt, kein Extra-Paket nötig):

```bash
npx playwright cli --help     # token-sparsame Browser-Steuerung, State auf Disk
npx playwright mcp            # MCP-Server für interaktive Prompts
npx playwright trace open …   # Trace-Analyse ohne Trace Viewer
```

## Tech-Stack

Next.js 16 (App Router) · HeroUI · Tailwind CSS · TypeScript · next-auth (Auth.js v5) · Playwright
