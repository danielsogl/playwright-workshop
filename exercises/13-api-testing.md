# Übung 13 – API-Tests mit der Request API

**Ziel:** Du testest die REST-API der App direkt, ohne Browser, mit Playwrights `request`-Fixture.
**Zeit:** 30 Min. (Pflicht) · **Startbranch:** `git switch ex/13-api-testing` · **Datei:** `e2e/13-api-testing.spec.ts`

> Roter Faden: Baut auf Übung 7 (Login mit `test@example.com` / `password`) · Du gibst weiter: schnelle API-Tests als Ergänzung zu UI-Tests · Zurückgefallen? `git switch ex/13-api-testing`. Der Startbranch enthält die Lösungen der Übungen 1–12, aber nicht die dieser Übung. Musterlösung: `git diff ex/13-api-testing ex/14-clock`.

API-Tests sind schnell, weil kein Browser eine Seite rendert. Die App läuft mit `RSS_OFFLINE_MODE=true` (siehe `.env.example`).

## Begriffe

- `request`: eine Playwright-Fixture (`APIRequestContext`) für HTTP-Aufrufe wie `request.get(url)` und `request.post(url, { data })`. `baseURL` aus der Config gilt, du schreibst nur den Pfad.
- **Cookie-Jar:** der Speicher für Cookies. Die `request`-Fixture hat einen eigenen, getrennten Jar. `page.request` teilt ihn mit der Seite, so sieht die Seite einen Login, den du per API gemacht hast.
- **CSRF-Token:** Auth.js verlangt vor dem Login einen einmaligen Token, der vor Cross-Site-Formularen schützt. Du holst ihn mit `GET /api/auth/csrf` und schickst ihn beim Login mit.
- `data` sendet einen JSON-Body, `form` einen URL-kodierten Formular-Body.

## Aufgaben

### Aufgabe 1 – Öffentlicher Feed (GET)
Lege `e2e/13-api-testing.spec.ts` an und rufe `GET /api/news/public` mit der `request`-Fixture auf.

**Fertig, wenn:** Test grün. `await expect(response).toBeOK()` und die Liste `items` im JSON ist nicht leer (mit Offline-Feed 20 Einträge).

<details><summary>Tipp</summary>

`const body = await response.json()`. Mit `request.get<{ items: unknown[] }>(...)` ist `json()` typisiert.
</details>

### Aufgabe 2 – Login über die API
Melde dich ohne UI an: 1) CSRF-Token holen, 2) `POST /api/auth/callback/credentials` mit `form`, 3) Session und geschützte Route prüfen. Nimm `page.request`, damit der Session-Cookie erhalten bleibt.

**Fertig, wenn:** Test grün. `/api/auth/session` liefert `user.email` = `test@example.com`, `/api/user` liefert `email` = `test@example.com` und `name` = `Test User`.

<details><summary>Tipp</summary>

Formularfelder für den Login: `email`, `password`, `csrfToken`, `callbackUrl` (z. B. `'/'`) und `json: 'true'`. Mit `json: 'true'` antwortet Auth.js mit 200 statt einem Redirect. Den Token liefert `csrfToken` aus der JSON-Antwort von `/api/auth/csrf`.
</details>

### Aufgabe 3 – Signup (POST mit JSON)
Lege über `POST /api/auth/signup` einen neuen Benutzer an. Der Body (`data`) hat `name`, `email` und `password` (mind. 6 Zeichen). Die E-Mail muss eindeutig sein, z. B. mit `Date.now()`.

**Fertig, wenn:** Test grün. Status 201, `message` ist „User created successfully“ und `user.email` ist die gesendete E-Mail.

> Achtung: Der Test legt echte Benutzer an. Sie liegen im Speicher des Servers und verschwinden, wenn du den Dev-Server neu startest.

### Aufgabe 4 – Fehlerfälle
Teste zwei Fehlerantworten von `/api/auth/signup`:

- Eine bereits vorhandene E-Mail (`test@example.com`) liefert Status **409**, `message` enthält „already registered“.
- Ungültige Daten (leerer Name, E-Mail `invalid-email`, Passwort `123`) liefern Status **400**, `message` ist „Validation failed“ und `errors` ist gesetzt.

**Fertig, wenn:** beide Prüfungen grün sind und `npx playwright test e2e/13-api-testing.spec.ts` durchläuft.

## Bonus (optional)

Rufe nach dem Login in Aufgabe 2 `page.goto('/')` auf und prüfe, dass der Button „user profile actions menu“ sichtbar ist. Damit weist du nach, dass die Seite den API-Login sieht.

## Wenn du nicht weiterkommst

Musterlösung ansehen: `git diff ex/13-api-testing ex/14-clock` oder `git switch ex/14-clock`.
