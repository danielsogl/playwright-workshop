# Übung 5 – News Feed Suche testen

**Ziel:** Du testest die Suche auf `/news/public` mit `beforeEach`, Eingaben und dynamischen Ergebnissen und analysierst einen fehlgeschlagenen Test im Trace.
**Zeit:** 25 Min. (Pflicht) · Bonus: +10 Min. · **Startbranch:** `git switch ex/05-suche` · **Datei:** `e2e/05-suche.spec.ts`

> Roter Faden: Baut auf: Übung 4, Assertions und Locators auf `/news/public`. · Du gibst weiter: deinen ersten vollwertigen Feature-Test. Genau diesen Test refactorierst du in Übung 9 ins Page Object Model, halte ihn griffbereit. Übung 11 (Mocking) greift ihn wieder auf. · Zurückgefallen? → `git switch ex/05-suche` (Startpunkt mit den Lösungen aller früheren Übungen). Die Musterlösung zeigt `git diff ex/05-suche ex/06-accessibility`.

Die Zahlen in dieser Übung (20 Artikel, „Technology“ 9, „Cybersecurity“ 1) gelten nur mit dem Offline-Feed (`RSS_OFFLINE_MODE=true` in deiner `.env`). Der Live-Feed ändert sich laufend.

## Aufgaben

### Aufgabe 1 – Suite mit `beforeEach`
Lege `e2e/05-suche.spec.ts` an. Packe alle Tests in einen `test.describe`-Block. Ein `test.beforeEach` öffnet vor jedem Test `/news/public` und wartet, bis der erste Artikel sichtbar ist.

**Fertig, wenn:** die Datei einen `describe`-Block mit `beforeEach` enthält (die Tests folgen in Aufgabe 2 bis 3).

<details><summary>Tipp</summary>
`test.beforeEach(async ({ page }) => { … })` läuft vor jedem Test im Block. Warte mit `expect(page.getByRole('article').first()).toBeVisible()`.
</details>

### Aufgabe 2 – Initiale Anzeige
Schreibe einen Test, der prüft, dass der Feed 20 Artikel zeigt und dass der erste Artikel eine sichtbare Überschrift (`heading`) hat.

**Fertig, wenn:** der Test grün ist.

<details><summary>Tipp</summary>
`getByRole('article')` und `toHaveCount(20)`. Die Überschrift suchst du verkettet am ersten Artikel.
</details>

### Aufgabe 3 – Suche testen
Das Suchfeld („Search news articles“, Rolle `textbox`) filtert schon beim Tippen. Schreibe Tests für diese Fälle:
- „XYZ123NonExistent“: 0 Artikel und der Text „0 articles found“.
- Danach das Feld leeren: wieder 20 Artikel.
- „Technology“: 9 Artikel, der erste enthält „technology“ (ohne Beachtung der Groß-/Kleinschreibung).
- „Cybersecurity“: genau 1 Artikel mit einer sichtbaren Überschrift.

**Fertig, wenn:** alle Tests grün sind und die Zahlen 0, 20, 9 und 1 stimmen.

<details><summary>Tipp</summary>
`fill()` füllt das Feld, `clear()` leert es. `toHaveCount()` und `toContainText()` warten selbst, du brauchst weder `waitForTimeout` noch `networkidle`. Die Suche läuft im Browser, es gibt keinen Netzwerk-Request zum Abwarten.
</details>

### Aufgabe 4 – Fehlgeschlagenen Test im Trace analysieren
Ein **Trace** ist eine Aufzeichnung des Testlaufs mit Screenshots, Aktionen und Netzwerk. Die Config zeichnet nur beim Retry auf (`trace: 'on-first-retry'`), lokal gibt es keine Retries, deshalb entsteht dort kein Trace. Schalte ihn per CLI an: Brich einen Test absichtlich (z. B. 21 statt 20 Artikel erwarten) und starte `npx playwright test e2e/05-suche.spec.ts --trace retain-on-failure`. Öffne danach `npx playwright show-report` und dort den Trace des fehlgeschlagenen Tests. Mache die Änderung anschließend rückgängig.

**Fertig, wenn:** du im Trace den fehlgeschlagenen Schritt gefunden hast, und `npx playwright test e2e/05-suche.spec.ts` wieder grün ist.

<details><summary>Tipp</summary>
Der Trace-Viewer zeigt links die Schritte, rechts den DOM-Snapshot vor und nach der Aktion. Der rote Schritt ist die fehlgeschlagene Assertion.
</details>

## Bonus (optional)
### Bonus A – Suche zurücksetzen und Tastatur
Schreibe einen Test, der nach einer Suche mit `clear()` und Enter wieder alle 20 Artikel erwartet. Schreibe einen weiteren, der das Suchfeld per `focus()` fokussiert, „Keyboard Test“ mit `pressSequentially()` tippt und danach den Wert prüft.

### Bonus B – Suchfeld nach Navigation
Tippe „Playwright“ ein, gehe über das Logo („Go to homepage“) zur Startseite und über „View Public News“ zurück. Prüfe, dass das Suchfeld wieder leer ist.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/05-suche ex/06-accessibility` · oder `git switch ex/06-accessibility`.
