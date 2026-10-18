# Übung 1 – Setup-Check

**Ziel:** Du prüfst, dass bei dir alles läuft: die Demo-App, Playwright und alle drei Browser. Du schreibst noch keinen eigenen Test.
**Zeit:** 15 Min. (Pflicht) · Bonus: +15 Min. · **Startbranch:** `git switch ex/01-setup` · **Datei:** keine, du führst `e2e/example.spec.ts` aus

> Roter Faden: Baut auf: nichts, das hier ist der Grundstein. · Du gibst weiter: ein lauffähiges Setup (`.env`, App, Browser), auf dem alle folgenden Übungen aufbauen. · Zurückgefallen? → `git switch ex/01-setup` (Startpunkt). Die Musterlösung der Bonus-Aufgaben zeigt `git diff ex/01-setup ex/01b-codegen`.

Ein **Smoke-Test** ist ein minimaler Test, der nur prüft, ob die App grundsätzlich läuft. Das Repo bringt mit `e2e/example.spec.ts` schon einen mit.

## Aufgaben

### Aufgabe 1 – Repo klonen und installieren
Klone das Repo, wechsle in den Ordner und installiere die Pakete und die Browser (Chromium, Firefox, WebKit):

```bash
git clone https://github.com/danielsogl/playwright-workshop.git
cd playwright-workshop
npm install
npx playwright install
```

**Fertig, wenn:** alle Befehle ohne Fehler durchgelaufen sind.

<details><summary>Tipp</summary>
Der Browser-Download dauert ein paar Minuten. Lies in der Zwischenzeit Aufgabe 4. Unter Linux installiert `npx playwright install --with-deps` auch die Systemabhängigkeiten.
</details>

### Aufgabe 2 – `.env` anlegen und die App starten
Kopiere `.env.example` nach `.env`. Die Datei enthält die Test-Zugangsdaten, ein `AUTH_SECRET` und `RSS_OFFLINE_MODE=true`.

Der **Offline-Feed** liefert immer dieselben 20 statischen Artikel statt Live-RSS-Daten. Alle festen Zahlen im Workshop (z. B. 20 Artikel) gelten nur damit. Lass die Variable auf `true`.

Starte die App mit `npm run dev` und öffne `http://localhost:3000` im Browser. Melde dich mit `test@example.com` / `password` an.

**Fertig, wenn:** du die Startseite mit „Welcome to the Playwright Demo App“ siehst und der Login klappt. Stoppe den Server danach mit `Ctrl+C`.

<details><summary>Tipp</summary>
Meldet `npm run dev`, dass Port 3000 belegt ist, läuft dort schon etwas anderes (z. B. ein Docker-Container). Beende es, sonst testet Playwright später gegen die falsche App.
</details>

### Aufgabe 3 – Playwright prüfen
Prüfe die Version mit `npx playwright --version`. Führe dann den mitgelieferten Smoke-Test aus und öffne den HTML-Report:

```bash
npx playwright test e2e/example.spec.ts
npx playwright show-report
```

**Fertig, wenn:** die Ausgabe `3 passed` zeigt (ein Test, drei Browser) und sich der Report im Browser öffnet.

<details><summary>Tipp</summary>
Meldet ein Browser „Executable doesn't exist“, fehlt der Download aus Aufgabe 1: `npx playwright install`. Den Dev-Server musst du nicht selbst starten, das übernimmt Playwright (Aufgabe 4).
</details>

### Aufgabe 4 – Playwright-Konfiguration lesen
Öffne `playwright.config.ts` und suche den Block `webServer`. Beantworte für dich:
1. Welcher Befehl startet die App?
2. Woran erkennt Playwright, dass sie bereit ist?
3. Was passiert, wenn die App schon läuft?

**Fertig, wenn:** du alle drei Fragen beantworten kannst.

<details><summary>Antworten</summary>
`command` startet die App. Playwright wartet, bis `url` antwortet (höchstens `timeout` ms). Lokal wird ein bereits laufender Server wiederverwendet (`reuseExistingServer`), auf CI (Variable `CI` gesetzt) startet Playwright immer einen frischen.
</details>

## Bonus (optional)
### Bonus A – Im UI Mode zusehen
Starte `npx playwright test e2e/example.spec.ts --ui`, führe den Test aus und klicke im Zeitstrahl auf die einzelnen Schritte. **Fertig, wenn:** du den Testlauf im UI Mode gesehen hast.

### Bonus B – Eigener Smoke-Test
Lege `e2e/01-setup.spec.ts` an und schreibe einen Test „App ist erreichbar“: Öffne die Startseite, prüfe den Seitentitel (er enthält „Playwright Demo“) und dass die Hauptnavigation sichtbar ist. Orientiere dich an `example.spec.ts`. **Fertig, wenn:** `npx playwright test 01-setup` grün ist.

### Bonus C – Mehrere Seiten prüfen
Schreibe einen zweiten Test, der `/`, `/news/public` und `/auth/signin` in einer Schleife aufruft. Prüfe pro Seite Titel und URL. **Fertig, wenn:** der Test grün ist.

### Bonus D – Umgebungsvariablen geprüft
Prüfe in einem dritten Test, dass `process.env.TEST_USER_EMAIL` und `process.env.TEST_USER_PASSWORD` gesetzt sind (`toBeDefined()`). Die Config lädt die `.env` per `dotenv`. **Fertig, wenn:** der Test grün ist.

## Wenn du nicht weiterkommst
Musterlösung der Bonus-Aufgaben ansehen: `git diff ex/01-setup ex/01b-codegen` · oder `git switch ex/01b-codegen`.
