# Übung 1 – Projekt-Setup

**Ziel:** Du richtest das Playwright-Projekt für die Feed Demo App ein und bringst einen ersten Smoke-Test zum Laufen.
**Zeit:** 15 Min. (Pflicht) · Bonus: +10 Min. · **Startbranch:** `git switch ex/01-setup` · **Datei:** `e2e/01-setup.spec.ts`

> Roter Faden: Baut auf: nichts, das hier ist der Grundstein. · Du gibst weiter: ein lauffähiges Setup (`.env`, `webServer`, Smoke-Test), auf dem alle folgenden Übungen aufbauen. · Zurückgefallen? → `git switch ex/01-setup` (Startpunkt). Die Musterlösung zeigt `git diff ex/01-setup ex/02-locators`.

Ein **Smoke-Test** ist ein minimaler Test, der nur prüft, ob die App grundsätzlich läuft.

## Aufgaben

### Aufgabe 1 – Abhängigkeiten installieren
Wechsle in den Ordner `playwright-workshop` und installiere die Pakete und die Browser (Chromium, Firefox, WebKit).

**Fertig, wenn:** `npm install` und `npx playwright install` ohne Fehler durchgelaufen sind.

<details><summary>Tipp</summary>
Beide Befehle brauchen ein paar Minuten, der Browser-Download ist am größten. Lies in der Zwischenzeit Aufgabe 3.
</details>

### Aufgabe 2 – `.env` anlegen und die App starten
Kopiere `.env.example` nach `.env`. Die Datei enthält die Test-Zugangsdaten, ein `AUTH_SECRET` und `RSS_OFFLINE_MODE=true`.

Der **Offline-Feed** liefert immer dieselben 20 statische Artikel statt Live-RSS-Daten. Alle festen Zahlen im Workshop (z. B. 20 Artikel) gelten nur damit. Lass die Variable auf `true`.

Starte die App einmal selbst mit `npm run dev` und öffne `http://localhost:3000` im Browser.

**Fertig, wenn:** `.env` existiert und du im Browser die Startseite mit „Welcome to the Playwright Demo App“ siehst. Stoppe den Server danach mit `Ctrl+C`.

### Aufgabe 3 – Playwright-Konfiguration lesen
Öffne `playwright.config.ts` und suche den Block `webServer`. Beantworte für dich:
1. Welcher Befehl startet die App?
2. Woran erkennt Playwright, dass sie bereit ist?
3. Was passiert, wenn die App schon läuft?

**Fertig, wenn:** du alle drei Fragen beantworten kannst.

<details><summary>Antworten</summary>
`command` startet die App. Playwright wartet, bis `url` antwortet (höchstens `timeout` ms). Lokal wird ein bereits laufender Server wiederverwendet (`reuseExistingServer`), auf CI (Variable `CI` gesetzt) startet Playwright immer einen frischen.
</details>

### Aufgabe 4 – Smoke-Test schreiben
Lege `e2e/01-setup.spec.ts` an und schreibe einen Test „App ist erreichbar“: Öffne die Startseite, prüfe den Seitentitel (er enthält „Playwright Demo“) und prüfe, dass die Hauptnavigation sichtbar ist.

**Fertig, wenn:** die Datei einen Test mit zwei `expect`-Aufrufen enthält.

<details><summary>Tipp</summary>
Importiere `test` und `expect` aus `@playwright/test`. Mit `page.goto('/')` öffnest du die Startseite, `baseURL` steht schon in der Config. Nutze `toHaveTitle()` mit einem RegExp. Für die Navigation: `getByRole('navigation')`. Es gibt mehrere, hänge `.first()` an.
</details>

### Aufgabe 5 – Test ausführen und Report ansehen
Führe nur deine Datei aus und öffne danach den HTML-Report.

**Fertig, wenn:** die Ausgabe `3 passed` zeigt (ein Test, drei Browser) und sich der Report im Browser öffnet.

<details><summary>Tipp</summary>
`npx playwright test 01-setup` startet den Server automatisch. `npx playwright show-report` öffnet den Report.
</details>

## Bonus (optional)
### Bonus A – Mehrere Seiten prüfen
Schreibe einen zweiten Test, der `/`, `/news/public` und `/auth/signin` in einer Schleife aufruft. Prüfe pro Seite Titel und URL. **Fertig, wenn:** der Test grün ist.

### Bonus B – Umgebungsvariablen geprüft
Prüfe in einem dritten Test, dass `process.env.TEST_USER_EMAIL` und `process.env.TEST_USER_PASSWORD` gesetzt sind (`toBeDefined()`). Die Config lädt die `.env` per `dotenv`. **Fertig, wenn:** der Test grün ist.

### Bonus C – UI-Mode
Starte `npx playwright test --ui` und klicke dich durch die Oberfläche. **Fertig, wenn:** du einen Testlauf im UI-Mode gesehen hast.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/01-setup ex/02-locators` · oder `git switch ex/02-locators`.
