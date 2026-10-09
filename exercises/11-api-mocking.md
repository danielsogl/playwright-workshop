# Übung 11 – API Mocking

**Ziel:** Du ersetzt die Antwort der News-API durch eigene Daten und testest Erfolg, Fehler, leere Liste und Ladezustand.
**Zeit:** 30 Min. (Pflicht) · Bonus: +10 Min. · **Startbranch:** `git switch ex/11-api-mocking` · **Datei:** `e2e/11-api-mocking.spec.ts` (Mock-Daten: `e2e/mocks/news-mocks.ts`)

> Roter Faden: Baut auf Übung 5 und 9 (`/news/public`, Suche) · Du gibst weiter: `e2e/mocks/news-mocks.ts`, Übung 12 importiert daraus · Zurückgefallen? `git switch ex/11-api-mocking`. Der Startbranch enthält die Lösungen der Übungen 1–10, aber nicht die dieser Übung. Musterlösung: `git diff ex/11-api-mocking ex/12-waitforresponse`.

**Mock:** Der Browser fragt die API wie gewohnt an, Playwright fängt den Request ab und antwortet selbst. Das macht Tests schnell, unabhängig vom Backend und erlaubt Fehlerfälle, die du sonst kaum auslösen kannst.

Die Seite `/news/public` lädt ihre Artikel von `GET /api/news/public`. Alle Abfragen laufen gegen diese URL.

## Begriffe

- `page.route(url, handler)`: fängt Requests ab, die zur URL passen (`**` steht für beliebigen Pfad davor). Registriere die Route **vor** `page.goto()`.
- `route.fulfill({ status, json })`: beantwortet den Request selbst. `json` serialisiert den Body und setzt den Content-Type.
- Den Handler schreibst du `async` und rufst `route.fulfill(...)` immer mit `await` auf.

## Aufgaben

### Aufgabe 1 – Mock-Daten anlegen
Lege `e2e/mocks/news-mocks.ts` an. Exportiere:

- `mockNewsData.success`: Objekt mit `items` (2 Artikel): „Test Technology News“ (Kategorie `Technology`) und „Test Business News“ (Kategorie `Business`).
- `mockNewsData.empty`: `items` ist ein leeres Array.
- `mockSearchFeed`: `items` mit genau einem Artikel, Titel „Gemockte News“, Kategorie `Technology` (Übung 12 braucht ihn).

Jeder Artikel hat die Felder `title`, `link`, `description`, `category`, `source`, `pubDate`, `isoDate`.

**Fertig, wenn:** die Datei kompiliert und die drei Exporte existieren.

<details><summary>Tipp</summary>

Schau dir den Aufbau echter Artikel an: `curl localhost:3000/api/news/public` (Offline-Feed, `RSS_OFFLINE_MODE=true`). `pubDate` ist ein Datumstext, `isoDate` ein ISO-String wie `2024-01-01T10:00:00.000Z`.
</details>

### Aufgabe 2 – Erfolgsfall
Lege `e2e/11-api-mocking.spec.ts` an. Mocke die API mit `mockNewsData.success` und öffne `/news/public`.

**Fertig, wenn:** Test grün. Genau 2 `article` sind sichtbar, „Test Technology News“ und „Test Business News“ stehen auf der Seite (nicht die 20 Artikel des echten Feeds).

<details><summary>Tipp</summary>

```typescript
await page.route('**/api/news/public', async (route) => {
  await route.fulfill({ json: mockNewsData.success });
});
```
</details>

### Aufgabe 3 – Fehlerfall
Antworte mit Status 500 und einem JSON-Body deiner Wahl.

**Fertig, wenn:** Test grün. Ein `alert` mit dem Text „Failed to load RSS feeds“ ist sichtbar, das `feed` „News articles“ ist ausgeblendet.

<details><summary>Tipp</summary>

`route.fulfill({ status: 500, json: { ... } })`. Filtere den Alert über den Text: `getByRole('alert').filter({ hasText: '…' })`, sonst triffst du die Ansage von Next.js.
</details>

### Aufgabe 4 – Leere Daten
Antworte mit `mockNewsData.empty`.

**Fertig, wenn:** Test grün. „0 articles found“ ist sichtbar und es gibt keinen `article`. Die App hat keinen eigenen Leer-Hinweis, nur diesen Zähler.

### Aufgabe 5 – Ladezustand
Verzögere die Antwort um 2 Sekunden, bevor du sie auslieferst.

**Fertig, wenn:** Test grün. Der `status` „Loading news feed“ erscheint, verschwindet wieder und danach sind 2 Artikel zu sehen.

<details><summary>Tipp</summary>

Im Handler vor `fulfill` mit `await new Promise((resolve) => setTimeout(resolve, 2000))` warten. `page.goto()` wartet nur auf das `load`-Event, nicht auf die API, deshalb siehst du den Ladezustand.
</details>

## Bonus (optional)

### Bonus A – Suche mit Mock
Die Suche filtert clientseitig, sie löst keinen API-Call aus. Mocke `success`, suche „business“ und prüfe: 1 Treffer. Suche „nonexistent“: 0 Treffer. Leeren: wieder 2.

**Fertig, wenn:** der Test grün ist.

### Bonus B – Rate Limit (429) zur Laufzeit umschalten
**429** („Too Many Requests“) ist der Status, mit dem eine API sagt: zu viele Anfragen (Rate Limit). Lass die API beim ersten Laden normal antworten und nach `page.reload()` mit 429. Dazu setzt du eine Variable `rateLimited`, die der Handler liest. Wenn der Request keine GET-Anfrage ist, gibst du ihn mit `route.fallback()` weiter (`fallback` reicht den Request an andere Handler oder das Netzwerk durch, statt ihn selbst zu beantworten).

**Fertig, wenn:** nach dem Reload der „Failed to load RSS feeds“-Alert sichtbar ist und kein `article` mehr da ist.

### Bonus C – Hängende API
Beantworte den Request nie (`await page.route(..., () => {})`): Der Ladezustand bleibt stehen und es gibt 0 Artikel.

## Wenn du nicht weiterkommst

Musterlösung ansehen: `git diff ex/11-api-mocking ex/12-waitforresponse` oder `git switch ex/12-waitforresponse`.
Alles fertig, wenn `npx playwright test e2e/11-api-mocking.spec.ts` grün ist.
