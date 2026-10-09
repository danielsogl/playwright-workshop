# Übung 8 – Playwright Fixtures

**Ziel:** Du baust drei Fixtures: Testdaten, einen Seiten-Helfer und einen eingeloggten Page-Zugang. Damit werden deine Tests kürzer und wiederverwendbar.
**Zeit:** 35 Min. (Pflicht) · Bonus: +10 Min. · **Startbranch:** `git switch ex/08-fixtures` · **Dateien:** `e2e/08-fixtures.spec.ts`, `e2e/fixtures/auth.fixture.ts`

> Roter Faden: Baut auf: Übung 7, den Login (CSRF, dann `credentials`) kapselst du jetzt als Fixture. · Du gibst weiter: `e2e/fixtures/auth.fixture.ts`, die der Capstone (Übung 17) importiert. · Zurückgefallen? → `git switch ex/08-fixtures` (Startpunkt mit den Lösungen aller früheren Übungen). Die Musterlösung zeigt `git diff ex/08-fixtures ex/09-page-objects`. Die Dateien dort heißen genau wie in dieser Übung.

## Was ist eine Fixture?

Eine **Fixture** liefert einem Test fertig vorbereitete Dinge: `page` und `request` kennst du bereits. Eigene Fixtures definierst du mit `base.extend({ … })`. Der Test bekommt sie, indem er ihren Namen im Parameter nennt. In der Fixture-Funktion läuft alles **vor** `await use(wert)` als Vorbereitung. `use(wert)` reicht den Wert an den Test weiter. Was **nach** `use()` steht, läuft nach dem Test als Aufräumen, auch wenn er scheitert.

```typescript
const test = base.extend<{ meinWert: string }>({
  meinWert: async ({}, use) => { await use('Hallo'); },
});
```

## Aufgaben

### Aufgabe 1 – Demo-Seite erkunden
Starte die App (`npm run dev`) und öffne `/fixtures-demo`. Füge von Hand einen Benutzer hinzu.
**Fertig, wenn:** du die zwei Start-Benutzer (John Doe, Jane Smith), den Zähler „2 users“ und danach „3 users“ gesehen hast. Der Button heißt „Add User“, im Bearbeiten-Modus „Update User“.

### Aufgabe 2 – Fixture `testUser`
Lege `e2e/08-fixtures.spec.ts` an. Definiere eine Fixture `testUser`, die pro Test eindeutige Daten (Name, E-Mail, Rolle `user`) liefert. Schreibe einen Test, der damit auf `/fixtures-demo` einen Benutzer hinzufügt. Logge in der Fixture eine Meldung vor und eine nach `use()`.
**Fertig, wenn:** der Test grün ist, „3 users“ sichtbar ist und die Konsole beide Meldungen zeigt (`--reporter=line`).
<details><summary>Tipp</summary>
Eindeutig wird der Name mit `Date.now()`. Felder: `getByLabel('Name')`, `getByLabel('Email')`, `getByLabel('Role')` mit `selectOption(...)`. Die Textfelder füllst du mit `pressSequentially(...)`, weil `fill()` den State dieser React-Aria-Felder in WebKit nicht zuverlässig setzt. Der Button: `getByRole('button', { name: /add user|update user/i })`, die Regex deckt beide Beschriftungen ab. Die Fixture-Typen gibst du an `base.extend<{ testUser: { name: string; email: string; role: string } }>` mit.
</details>

### Aufgabe 3 – Fixture `userPage` als Seiten-Helfer
Erweitere um eine Fixture `userPage`, die `/fixtures-demo` öffnet und zwei Funktionen liefert: `addUser(user)` und `getUserCount()`. Schreibe zwei Tests: Mit `testUser` steigt der Zähler um 1, beim Hinzufügen von zwei festen Benutzern um 2.
**Fertig, wenn:** beide Tests grün sind. Sie vergleichen den Zähler vor und nach dem Hinzufügen und fest kodieren die Startzahl nicht.
<details><summary>Tipp</summary>
Die Fixture bekommt `page` und baut ein Objekt mit den beiden Funktionen, das sie per `use(...)` weitergibt. `addUser` wiederholt die Schritte aus Aufgabe 2 und wartet am Ende, bis der Name sichtbar ist. `getUserCount` liest den Text `getByText(/\d+ users/)` und gibt die Zahl zurück. Warte vorher, bis der Zähler nicht mehr „0 users“ zeigt: `toContainText(/[1-9]\d* users/)`. Lege dafür ein zweites `base.extend<…>` an (z. B. `testWithHelpers`), das `testUser` und `userPage` enthält.
</details>

### Aufgabe 4 – Auth-Fixture `authenticatedPage`
Lege `e2e/fixtures/auth.fixture.ts` an. Sie exportiert ein `test` mit der Fixture `authenticatedPage`, einer `page`, die bereits eingeloggt ist. Der Login läuft per API wie im Bonus A aus Übung 7: `GET /api/auth/csrf`, dann `POST /api/auth/callback/credentials` mit `email`, `password`, `csrfToken`, `callbackUrl: '/'` und `json: 'true'`. Exportiere außerdem `expect`. Nutze die Fixture in `e2e/08-fixtures.spec.ts`, um `/news/private` zu öffnen.
**Fertig, wenn:** der Test grün ist und die Überschrift „Your Private News Feeds“ sichtbar ist, ohne dass er das Login-Formular benutzt.
<details><summary>Tipp</summary>
Sende die Requests über `page.request`, nicht über die separate Fixture `request`: `page.request` teilt den Cookie-Speicher mit der Seite, so landet der Session-Cookie direkt im Browser. Prüfe die Antwort mit `await expect(login).toBeOK()`. Importiere in der Spec `test as authTest` aus `./fixtures/auth.fixture`, damit sich beide `test`-Objekte nicht in die Quere kommen. Der Capstone (Übung 17) importiert genau diese Datei.
</details>

**Alles fertig, wenn:** `npx playwright test e2e/08-fixtures.spec.ts --project=chromium --reporter=line` grün ist.

**Überlege:** Wann ist die Fixture besser als der `storageState` aus Übung 7? (Tipp: Tests, die einen frischen Login oder einen anderen User brauchen.)

## Bonus (optional)

### Bonus A – Option-Fixture
Definiere `defaultRole` als **Option-Fixture** (Standardwert `user`) und nutze sie in `testUser`. Ein `describe` überschreibt den Wert für seine Tests per `test.use({ defaultRole: 'admin' })`.
**Fertig, wenn:** ein Test ohne Override die Rolle `user` sieht und ein Test im `describe` die Rolle `admin`.
<details><summary>Tipp</summary>
Eine Option-Fixture schreibst du als Array: `[wert, { option: true }]`.
</details>

### Bonus B – Fixture-Lebensdauer
Fixtures sind standardmäßig **test-scoped**: Für jeden Test entsteht eine neue Instanz. Mit `{ scope: 'worker' }` entsteht sie nur einmal pro Worker, sinnvoll für teure Vorbereitung.
**Fertig, wenn:** du in einer Fixture mit `scope: 'worker'` eine Meldung loggst und siehst, dass sie bei mehreren Tests im selben Worker nur einmal erscheint (`--workers=1`).

## Faustregeln
- Eine Fixture, eine Verantwortung. Klare Namen: `testUser`, nicht `data1`.
- Locators zuerst nutzerorientiert (`getByLabel`, `getByRole`), `getByTestId` nur als Ausweg.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/08-fixtures ex/09-page-objects` · oder `git switch ex/09-page-objects`.
