# Übung 7 – Authentifizierung mit Setup-Projekt

**Ziel:** Du loggst dich einmal per UI ein, speicherst den Login-Zustand und nutzt ihn in allen Tests, die einen eingeloggten User brauchen.
**Zeit:** 30 Min. (Pflicht) · Bonus: +20 Min. · **Startbranch:** `git switch ex/07-authentifizierung` · **Dateien:** `e2e/auth.setup.ts`, `e2e/07-authentifizierung.spec.ts`, `playwright.config.ts`

> Roter Faden: Baut auf: Übung 3 (Login-Formular) und Übung 1 (`.env` mit `TEST_USER_EMAIL` und `TEST_USER_PASSWORD`). · Du gibst weiter: den gespeicherten Login-Zustand `playwright/.auth/user.json` und die Idee „Login einmal, Tests viele Male“. Die API-Variante (Bonus A) ist die Grundlage der Fixture in Übung 8. · Zurückgefallen? → `git switch ex/07-authentifizierung` (Startpunkt mit den Lösungen aller früheren Übungen). Die Musterlösung zeigt `git diff ex/07-authentifizierung ex/08-fixtures`.

Ein **Setup-Projekt** ist ein eigenes Playwright-Projekt, das vor den Browser-Projekten läuft. Dein Login-Test lebt dort und speichert Cookies und Local Storage mit `storageState` in eine Datei (`user.json`). Die Browser-Projekte hängen per `dependencies` an dem Setup, so läuft der Login genau einmal pro Testlauf. Welche Tests den gespeicherten Zustand laden, entscheiden die Specs selbst per `test.use({ storageState })`.

Zugangsdaten der Demo-App (Seed-Daten): Test-User `test@example.com` / `password`, Admin `admin@example.com` / `admin123`. Der Test-User steht auch in deiner `.env`.

## Aufgaben

### Aufgabe 1 – Setup-Projekt in der Config
Ergänze in `playwright.config.ts` ein Projekt `setup`, das alle Dateien mit Endung `.setup.ts` findet. Lass die Desktop-Browser-Projekte (`chromium`, `firefox`, `webkit`) davon abhängen. Setze `storageState` **nicht** in die Projekt-Konfiguration: Sonst wären alle Tests eingeloggt, auch die Login-Tests aus Übung 3.
**Fertig, wenn:** `npx playwright test --list --project=setup` ohne Fehler durchläuft und `chromium`, `firefox` und `webkit` `dependencies: ['setup']` haben.
<details><summary>Tipp</summary>
Ein Eintrag in `projects`: `{ name: 'setup', testMatch: /.*\.setup\.ts/ }`. Bei den drei Desktop-Projekten kommt `dependencies: ['setup']` neben `use`. Der Eintrag `/playwright/.auth/` steht schon in `.gitignore` (Login-Daten gehören nicht ins Repo), den Ordner legt Playwright beim Speichern selbst an.
</details>

### Aufgabe 2 – UI-Login als Setup-Test
Lege `e2e/auth.setup.ts` an. Der Test `authenticate as user` loggt dich über die Seite `/auth/signin` ein und speichert den Zustand in `playwright/.auth/user.json`. Prüfe vor dem Speichern, dass der Login geklappt hat.
**Fertig, wenn:** `npx playwright test --project=setup` meldet `1 passed` und die Datei `playwright/.auth/user.json` existiert.
<details><summary>Tipp</summary>
`import { test as setup, expect } from '@playwright/test'` (Alias `setup` ist Konvention). Felder `getByLabel('Email')` und `getByLabel('Password')`, Button `getByRole('button', { name: 'Submit sign in form' })`. Zugangsdaten aus `process.env.TEST_USER_EMAIL` und `process.env.TEST_USER_PASSWORD`. Warte nach dem Klick auf `page.waitForURL('/')` und prüfe, dass der Button „User profile actions menu“ sichtbar ist. Speichern: `await page.context().storageState({ path: 'playwright/.auth/user.json' })`.
Stolperstein: Auth.js setzt das CSRF-Cookie beim Laden der Session. Wer vor `/api/auth/session` absendet, bekommt auf einem kalten Dev-Server den Fehler `MissingCSRF`. Starte `page.waitForResponse('**/api/auth/session')` **vor** `goto` und warte danach darauf.
</details>

### Aufgabe 3 – Tests mit gespeichertem Login
Lege `e2e/07-authentifizierung.spec.ts` an. Die Spec lädt `user.json` per `test.use({ storageState: ... })` und enthält drei Tests ohne eigenen Login-Schritt:
1. `/news/private` zeigt die Überschrift „Your Private News Feeds“ und die Liste „Your RSS feeds“.
2. Auf `/settings` wirst du nicht zu `/auth/signin` umgeleitet.
3. Das User-Menü zeigt `test@example.com`.

**Fertig, wenn:** `npx playwright test e2e/07-authentifizierung.spec.ts --project=chromium` grün ist (Setup plus 3 Tests) und kein Test das Login-Formular benutzt.
<details><summary>Tipp</summary>
Der Pfad zu `user.json` ist relativ zum Projekt-Root. `test.use({ storageState: 'playwright/.auth/user.json' })` steht auf Datei-Ebene oder in einem `describe`. Überschrift: `getByRole('heading', { name: 'Your Private News Feeds' })`, Liste: `getByRole('list', { name: 'Your RSS feeds' })`. Das Menü öffnest du mit `getByRole('button', { name: /user profile actions menu/i })`, danach ist die E-Mail per `getByText` sichtbar.
</details>

### Aufgabe 4 – Abmelden und Setup beobachten
Schreibe einen vierten Test: Menü öffnen, „Log out“ wählen. Danach ist der Link „Sign in to your account“ sichtbar. Lösche anschließend `playwright/.auth/user.json` und starte die Spec erneut.
**Fertig, wenn:** der Abmelde-Test grün ist, und nach dem Löschen der Datei der erneute Lauf zuerst `setup` ausführt und `user.json` wieder existiert.
<details><summary>Tipp</summary>
Der Menüpunkt ist `getByRole('menuitem', { name: /log out/i })`. Abmelden ändert nur den Browser, nicht die Datei: Folgetests sind weiter eingeloggt, weil jeder Test den Zustand frisch aus `user.json` lädt.
</details>

**Alles fertig, wenn:** `npx playwright test e2e/07-authentifizierung.spec.ts --project=chromium --project=firefox --project=webkit` grün ist (das Setup läuft in jedem Lauf vorher).

> **UI Mode:** `npx playwright test --ui` startet das `setup`-Projekt nicht automatisch. Führe es dort einmal manuell aus, sonst fehlt `user.json`.

## Bonus (optional)

### Bonus A – API-Login als zweiter Weg
Der UI-Login ist langsam. Schreibe in `e2e/auth.setup.ts` einen zweiten Setup-Test `authenticate as user via API`, der `user.json` **nicht** überschreibt, sondern `playwright/.auth/user-api.json` erzeugt. Der Ablauf: CSRF-Token holen (`GET /api/auth/csrf`), dann Formular-POST an `/api/auth/callback/credentials` mit E-Mail, Passwort und `csrfToken`.
**Fertig, wenn:** `npx playwright test --project=setup` meldet `2 passed` und `user-api.json` existiert. Prüfe im Test, dass `GET /api/auth/session` deine E-Mail liefert.
<details><summary>Tipp</summary>
Fixture `request` statt `page`. `await request.post(url, { form: { … } })`. Speichern mit `await request.storageState({ path })`. Zum Gegentest tauschst du in einer Spec kurz den Pfad in `test.use` aus. In Übung 8 kapselst du diesen Ablauf in eine Fixture.
</details>

### Bonus B – Admin als zweite Rolle
Erzeuge mit einem weiteren Setup-Test `authenticate as admin` die Datei `playwright/.auth/admin.json` (Admin `admin@example.com` / `admin123`). Ergänze in der Spec einen Test, der mit diesem Zustand läuft und im User-Menü `admin@example.com` zeigt.
**Fertig, wenn:** der Test grün ist. Tipp: `test.use` in einem eigenen `describe`, damit der User-Zustand der anderen Tests unberührt bleibt.

> **Geteilter Account:** Ändert ein Test Serverzustand des gemeinsamen Users (z. B. Settings), markiere ihn mit einem Test-Lock: `test('…', { lock: 'user-settings' }, async ({ page }) => { … })` (seit 1.63). Tests mit gleichem Lock-Namen laufen nie gleichzeitig, auch nicht über Worker und Projekte hinweg.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/07-authentifizierung ex/08-fixtures` · oder `git switch ex/08-fixtures`.
