# Übung 2 – Locators kennenlernen

**Ziel:** Du findest Elemente mit verschiedenen Locator-Strategien und gibst die Ergebnisse im Log aus.
**Zeit:** 15 Min. (Pflicht) · Bonus: +5 Min. · **Startbranch:** `git switch ex/02-locators` · **Datei:** `e2e/02-locators.spec.ts`

> Roter Faden: Baut auf: Übung 1, lauffähiges Setup mit `.env` (`RSS_OFFLINE_MODE=true`). · Du gibst weiter: dein Locator-Vokabular für `/` und `/news/public`, das du in Übung 4 mit Assertions einsetzt. · Zurückgefallen? → `git switch ex/02-locators` (Startpunkt mit den Lösungen aller früheren Übungen). Die Musterlösung zeigt `git diff ex/02-locators ex/03-interaktionen`. Keine Vorarbeit nötig, die App startet über den `webServer` automatisch.

Ein **Locator** beschreibt, wie Playwright ein Element auf der Seite findet. In dieser Übung nutzt du noch keine Assertions, sondern nur `console.log`. Die Soll-Werte siehst du in der Konsole.

## Aufgaben

### Aufgabe 1 – Startseite: drei Locators
Lege `e2e/02-locators.spec.ts` an und öffne darin `/`. Finde und logge:
- den Link „View Public News“ per Rolle und Name,
- den Text „Welcome to“ per sichtbarem Text,
- den Theme-Umschalter („Switch to dark mode“ bzw. „Switch to light mode“) per Label.

**Fertig, wenn:** der Test grün ist und die Konsole für Link und Theme-Umschalter `1` bzw. `true` zeigt.

<details><summary>Tipp</summary>
`getByRole('link', { name: /view public news/i })`, `getByText('Welcome to')`, `getByLabel(/switch to (dark|light) mode/i)`. Mit `await locator.count()` bekommst du die Trefferzahl, mit `await locator.isVisible()` einen Boolean.
Den Theme-Umschalter gibt es zweimal (Desktop und Mobile). `.visible()` am Locator behält nur die sichtbaren Elemente, danach bleibt genau einer übrig.
</details>

### Aufgabe 2 – News-Seite: vier Locators
Öffne `/news/public` in einem zweiten Test. Finde und logge:
- die Überschrift „News Feed“ per Text,
- das Suchfeld über seinen Platzhalter („Search news…“),
- alle Artikel per Rolle `article` (logge die Anzahl),
- die Überschrift des ersten Artikels per Verkettung.

**Fertig, wenn:** die Konsole `20` als Artikelanzahl und den Titel des ersten Artikels zeigt. Die 20 gelten nur mit dem Offline-Feed (`RSS_OFFLINE_MODE=true`).

<details><summary>Tipp</summary>
Verkettung heißt: ein Locator startet am anderen, z. B. `articles.first().getByRole('heading')`. Den Titel liest du mit `textContent()`. Der Feed lädt kurz: Warte vor `count()` mit `await articles.first().waitFor()`, denn `count()` wartet nicht von selbst.
</details>

### Aufgabe 3 – Locator-Playground
Starte `npx playwright test --ui`, öffne die Seite im Tab „Locator“ und nutze „Pick locator“. Klicke einige Elemente an und vergleiche die Vorschläge mit deinen eigenen Locators.

**Fertig, wenn:** du für den Link „View Public News“ den vorgeschlagenen Locator gesehen hast.

### Aufgabe 4 – Locator benennen
Gib dem Link-Locator mit `describe()` einen sprechenden Namen (z. B. „Link zu den Public News“) und logge den Locator. Die Beschreibung ersetzt ab Playwright 1.57 die Selektor-Darstellung in Log, Trace und Report.

**Fertig, wenn:** die Konsole „Link zu den Public News“ ausgibt statt des Selektors.

## Bonus (optional)
### Bonus A – Filter
Nimm das erste Wort des ersten Artikels als Suchtext und zähle mit `articles.filter({ hasText: … })`, wie viele Artikel es enthalten. **Fertig, wenn:** die Konsole eine Zahl größer 0 zeigt.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/02-locators ex/03-interaktionen` · oder `git switch ex/03-interaktionen`.
