# Übung 17 – Capstone: der komplette User-Flow

**Ziel:** Du führst Fixture, Page Object und Assertions aus den Übungen 7–9 zu einem einzigen End-to-End-Test zusammen: Login → Public News → Private Feeds → Settings → Logout.
**Zeit:** 60 Min. (Pflicht) · Bonus: +10 Min. · **Startbranch:** `git switch ex/17-capstone` · **Datei:** `e2e/17-capstone.spec.ts`

> Roter Faden: Baut auf Übung 7 (API-Login), Übung 8 (`authenticatedPage`-Fixture) und Übung 9 (`NewsPage`) auf. Neuer Stoff nur für den Test Lock (Aufgabe 1). · Du gibst weiter: einen Smoke-Test der kritischen User-Journey. · Zurückgefallen? `git switch ex/17-capstone` (enthält die Lösungen aller früheren Übungen, nicht die dieser Übung). Die Lösung dieser Übung steht im Folgebranch: `git diff ex/17-capstone ex/18-ai-assisted`.

## Vorbereitung

- `.env` ist angelegt (Übung 1) und enthält `RSS_OFFLINE_MODE=true`. Nur dann sind die festen Zahlen unten gültig (20 Artikel, 5 in „Business“).
- Diese Dateien existieren schon auf dem Startbranch, du nutzt sie nur:
  - `e2e/fixtures/auth.fixture.ts` – exportiert `test` und `expect` mit der Fixture `authenticatedPage` (eingeloggte Page).
  - `e2e/pages/NewsPage.ts` – Page Object mit `goto()`, `searchNews()`, `clearSearch()`, `filterByCategory()`, `resultsCount`, `newsFeed`.
- Die Lösung dieser Übung liegt **nicht** auf dem Startbranch. Du legst `e2e/17-capstone.spec.ts` selbst an.

## Aufgaben

### Aufgabe 1 – Gerüst mit Fixture und Test Lock
Lege `e2e/17-capstone.spec.ts` an. Importiere `test`/`expect` aus der Auth-Fixture (nicht aus `@playwright/test`) und `NewsPage`. Schreibe einen einzigen Test, der `authenticatedPage` nutzt.

Feeds und Profil hängen am gemeinsamen Test-User auf dem Server. Läuft der Test parallel in mehreren Projekten (z. B. chromium und webkit), verfälschen sich die Zahlen. Ein **Test Lock** sorgt dafür, dass Tests mit gleichem Lock-Namen nie gleichzeitig laufen. Syntax (neu, ab Playwright 1.63):

```typescript
test('Titel', { lock: 'test-user-account' }, async ({ authenticatedPage: page }) => { /* … */ });
```

**Fertig, wenn:** `npx playwright test e2e/17-capstone.spec.ts --project=chromium` läuft und der (noch leere) Test grün ist.

<details><summary>Tipp</summary>
Der Import-Pfad ist relativ zu `e2e/`: `./fixtures/auth.fixture` und `./pages/NewsPage`.
</details>

### Aufgabe 2 – Public News: Zähler, Suche, Kategorie
Mocke vorher `/api/news/public` mit dem Offline-Feed der App (Technik aus Übung 11: `page.route` + `route.fulfill({ path })`, Datei `app/api/feed.json`). Gehe mit `newsPage.goto()` auf `/news/public` und prüfe der Reihe nach:

| Schritt | Erwartung |
|---|---|
| Nach dem Laden | Zähler `20 articles found`, 20 `article` im Feed (`role="feed"`) |
| Suche `zzz-kein-treffer-xyz` | 0 Artikel |
| Suche zurücksetzen (`clearSearch()`) | wieder 20 Artikel |
| Kategorie **Business** | `5 articles found`, 5 Artikel |

**Fertig, wenn:** Test grün, alle vier Prüfungen stehen im Code. Du wartest nur über Assertions (`toHaveCount`, `toContainText`), nie über `waitForTimeout`.

<details><summary>Tipp</summary>
`page.route(...)` muss **vor** `newsPage.goto()` stehen. Zähler: `newsPage.resultsCount`, Artikel: `newsPage.newsFeed.getByRole('article')`.
</details>

### Aufgabe 3 – Private Feeds: anlegen, auswählen, löschen
Gehe auf `/news/private` (Überschrift „Your Private News Feeds“). Lege über das Formular einen Feed an, wähle ihn aus und lösche ihn wieder. Wichtig:

- Eindeutiger Name pro Lauf (z. B. mit `Date.now()`), gültige URL (z. B. `https://example.com/rss.xml`).
- Felder: `Name for the new feed`, `URL for the new feed`, Button `Add new feed`.
- Befülle die Felder mit `pressSequentially()` statt `fill()`: die react-aria-Felder übernehmen den Wert in WebKit sonst nicht zuverlässig (Hintergrund wie in Übung 8).
- Nach dem Anlegen erscheint der Button `Select feed: <Name>`. Die Liste heißt `Your RSS feeds`; der **Count-Chip** neben der Überschrift „Your Feeds“ zeigt die Anzahl der Einträge.
- Merke dir die Anzahl **nach** dem Anlegen und prüfe nach dem Löschen (`Delete feed: <Name>`), dass sie um 1 gesunken ist und der `Select feed:`-Button verschwunden ist.

**Fertig, wenn:** Der Test legt den Feed an, wählt ihn aus, löscht ihn und prüft: Feed sichtbar → Feed weg → Anzahl = vorher − 1. Zweimal hintereinander ausgeführt bleibt er grün.

<details><summary>Tipp</summary>
Einträge zählst du mit `page.getByRole('list', { name: 'Your RSS feeds' }).getByRole('listitem')` und `toHaveCount`. Feste Zahlen gehen nicht, der Test-User kann schon Feeds haben: vergleiche relativ.
</details>

### Aufgabe 4 – Settings: Name ändern, Session-Update prüfen
Gehe auf `/settings`. Ändere im Feld `Your name` den Namen auf `Capstone Tester` und sende mit `Submit profile update` ab. Prüfe zwei Dinge: das Success-Banner **und** die Initialen im Avatar der Navbar. Die Initialen stehen im Button `User profile actions menu`; sie beweisen, dass sich die Session über Komponentengrenzen hinweg aktualisiert hat.

**Fertig, wenn:** Der Test sieht `Profile updated successfully!` und der Navbar-Button enthält `CT`.

<details><summary>Tipp</summary>
Das Feld ist vorbefüllt. Leere es erst (klicken, `ControlOrMeta+a`, `Delete`) und tippe dann mit `pressSequentially()`. Die Initialen sind der erste Buchstabe jedes Namensteils.
</details>

### Aufgabe 5 – Logout
Öffne das User-Menü (`User profile actions menu`) und wähle `Log Out` (Rolle `menuitem`).

**Fertig, wenn:** Der Link `Sign in to your account` ist sichtbar. Der gesamte Test läuft mit `npx playwright test e2e/17-capstone.spec.ts --project=chromium` grün durch (dein 1 Test; das Auth-Setup läuft vorher mit und wird zusätzlich gezählt).

## Bonus (optional)

### Bonus A – Zweiter Browser
Lass den Test mit `--project=webkit` laufen. Überlege, was ohne den Test Lock passieren würde, wenn chromium und webkit gleichzeitig laufen (`--project=chromium --project=webkit`).

### Bonus B – Aufräumen
Der Namenswechsel in Aufgabe 4 bleibt am Test-User hängen. Setze den Namen am Ende des Tests zurück oder lege dafür eine Fixture mit Cleanup an (Übung 8).

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/17-capstone ex/18-ai-assisted` · oder `git switch ex/18-ai-assisted` und `e2e/17-capstone.spec.ts` lesen.
