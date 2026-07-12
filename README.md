# Playwright Workshop – Demo-App

Next.js Feed-App, die als Testobjekt für den 3-tägigen Playwright-Workshop dient.
Die App zeigt öffentliche und private News-Feeds, Login/Auth, Einstellungen und
weitere Seiten, gegen die die Übungen geschrieben werden.

## Voraussetzungen

- **Node.js 20 LTS oder neuer**
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

## Projektstruktur

```
exercises/    Übungsaufgaben (uebung-0 … uebung-10) – das, was die Teilnehmer umsetzen
solutions/    Musterlösungen (e2e-Specs + Page Objects) zum Abgleich
e2e/          Verzeichnis für die eigenen Tests der Teilnehmer
app/          Next.js App (news, auth, settings, clock, file-download, …)
components/   UI-Komponenten
config/       Seed-Daten & Site-Konfiguration
```

## Tech-Stack

Next.js 16 (App Router) · HeroUI · Tailwind CSS · TypeScript · next-auth (Auth.js v5) · Playwright
