# Übung 12 – API Mocking mit waitForResponse

**Ziel:** Du fängst die gemockte Antwort mit `page.waitForResponse` ab, prüfst Status und JSON und gleichst sie mit dem UI ab.
**Zeit:** 15 Min. (Pflicht) · **Startbranch:** `git switch ex/12-waitforresponse` · **Datei:** `e2e/12-waitforresponse.spec.ts`

> Roter Faden: Baut auf Übung 11 (`e2e/mocks/news-mocks.ts` mit `mockSearchFeed`) · Du gibst weiter: das Muster „Response abfangen und gegen das UI abgleichen“ · Zurückgefallen? `git switch ex/12-waitforresponse`. Der Startbranch enthält die Lösungen der Übungen 1–11 (also die Mock-Datei), aber nicht die dieser Übung. Musterlösung: `git diff ex/12-waitforresponse ex/13-api-testing`.

`page.waitForResponse(url)` liefert ein Promise, das erfüllt wird, sobald eine passende Antwort eintrifft. Du kannst dann `status()` und `json()` der Antwort prüfen.

## Aufgaben

### Aufgabe 1 – Spec anlegen und Antwort mocken
Lege `e2e/12-waitforresponse.spec.ts` an. Importiere `mockSearchFeed` aus `./mocks/news-mocks` und liefere ihn für `**/api/news/public` per `page.route` aus.

**Fertig, wenn:** nach `page.goto('/news/public')` genau 1 `article` sichtbar ist.

<details><summary>Tipp</summary>
`route.fulfill({ json: mockSearchFeed })`, siehe Übung 11.
</details>

### Aufgabe 2 – Response abfangen und prüfen
Hole die Antwort mit `page.waitForResponse('**/api/news/public')`. Wichtig: Lege das Promise **vor** `page.goto()` an und warte erst danach darauf, sonst kommt die Antwort, bevor du zuhörst. Prüfe Status 200, dass `items` die Länge 1 hat und der Titel „Gemockte News“ ist.

**Fertig, wenn:** alle drei Prüfungen auf der Response grün sind.

<details><summary>Tipp</summary>

Ohne `await` speichern: `const responsePromise = page.waitForResponse(...)`. Danach `goto`, dann `const response = await responsePromise`.
</details>

### Aufgabe 3 – UI abgleichen
Prüfe, dass das UI zeigt, was die Response geliefert hat: genau ein `article`, das „Gemockte News“ enthält.

**Fertig, wenn:** `npx playwright test e2e/12-waitforresponse.spec.ts` grün ist.

## Bonus (optional)

Mocke den Feed mit Status 500 und prüfe per `waitForResponse`, dass `response.status()` 500 ist, bevor du den Alert „Failed to load RSS feeds“ erwartest.

## Wenn du nicht weiterkommst

Musterlösung ansehen: `git diff ex/12-waitforresponse ex/13-api-testing` oder `git switch ex/13-api-testing`.
