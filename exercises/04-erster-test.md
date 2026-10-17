# Übung 4 – Erster Test mit Assertions

**Ziel:** Du schreibst Tests mit Assertions, die auf Elemente warten.
**Zeit:** 20 Min. (Pflicht) · Bonus: +5 Min. · **Startbranch:** `git switch ex/04-erster-test` · **Datei:** `e2e/04-erster-test.spec.ts`

> Roter Faden: Baut auf: Übung 2, du löst die dort aufgeschobenen Assertions auf `/` und `/news/public` ein. · Du gibst weiter: dein Assertion-Vokabular (`expect`, Auto-Waiting), Grundlage für die Debugging-Übung 4b und den Feature-Test in Übung 5. · Zurückgefallen? → `git switch ex/04-erster-test` (Startpunkt mit den Lösungen aller früheren Übungen). Die Musterlösung zeigt `git diff ex/04-erster-test ex/04b-debugging`.

**Auto-Waiting** heißt: Aktionen und `expect`-Assertions warten selbst, bis ein Element bereit ist. Feste Zahlen (20 Artikel) gelten nur mit dem Offline-Feed (`RSS_OFFLINE_MODE=true`).

## Aufgaben

### Aufgabe 1 – Navigation prüfen
Lege `e2e/04-erster-test.spec.ts` an. Öffne in einem Test `/`, finde den Link „View Public News“ und prüfe, dass er sichtbar ist und den Text „View Public News“ hat. Klicke ihn, prüfe die URL `/news/public`, gehe mit `page.goBack()` zurück und prüfe die Startseite.

**Fertig, wenn:** der Test grün ist.

<details><summary>Tipp</summary>
`getByRole('link', { name: … })`, `toBeVisible()`, `toHaveText()`, `toHaveURL()`. Nach dem Klick brauchst du keine Pause: `toHaveURL` wartet.
</details>

### Aufgabe 2 – Überschrift und Artikelliste
Öffne `/news/public`. Prüfe die Überschrift „News Feed“ (Rolle `heading`). Zähle die Artikel (Rolle `article`) und prüfe, dass es mehr als 0 sind. Logge die Zahl. Grenze die Artikel mit `filter({ hasText: 'Technology' })` ein und logge auch diese Zahl.

**Fertig, wenn:** der Test grün ist und die Konsole 20 Artikel zeigt (Offline-Feed).

<details><summary>Tipp</summary>
`count()` wartet nicht. Prüfe deshalb zuerst mit `expect(articles.first()).toBeVisible()`, dass die Artikel geladen sind, und zähle erst dann. Für die Zahl brauchst du `expect(count).toBeGreaterThan(0)` (ohne `await`, es ist eine normale Zahl).
</details>

### Aufgabe 3 – Suchfeld mit Assertions
Auf `/news/public`: Das Suchfeld („Search news articles“, Rolle `textbox`) ist sichtbar, editierbar und leer. Tippe „Playwright“ ein und prüfe den Wert. Drücke Enter. Prüfe, dass der Trefferzähler („N articles found“) zur Zahl der angezeigten Artikel passt. Leere das Feld und prüfe, dass es leer ist.

**Fertig, wenn:** der Test grün ist.

<details><summary>Tipp</summary>
Assertions: `toBeEditable()`, `toBeEmpty()`, `toHaveValue()`. Die Artikelzahl liest du mit `count()`, den Zähler suchst du per ``getByText(`${n} articles found`, { exact: true })``.
</details>

### Alles zusammen
`npx playwright test e2e/04-erster-test.spec.ts`

**Fertig, wenn:** alle Tests in allen Browsern grün sind.

## Bonus (optional)
### Bonus – Theme-Umschalter mit Assertions
Schreibe einen Test, der den sichtbaren Theme-Umschalter (Rolle `switch`) klickt und prüft, dass sich die Klasse von `<html>` ändert und beim zweiten Klick zurückkehrt. **Fertig, wenn:** der Test grün ist.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/04-erster-test ex/04b-debugging` · oder `git switch ex/04b-debugging`.
