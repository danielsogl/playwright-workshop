# Übung 1b – Test mit Codegen aufnehmen

**Ziel:** Du nimmst einen Test mit dem Test Generator (Codegen) auf, ergänzt Assertions über die Toolbar und bringst ihn zum Laufen.
**Zeit:** 15 Min. (Pflicht) · Bonus: +5 Min. · **Startbranch:** `git switch ex/01b-codegen` · **Datei:** `e2e/01b-codegen.spec.ts`

> Roter Faden: Baut auf: Übung 1, lauffähiges Setup mit `.env` (`RSS_OFFLINE_MODE=true`). · Du gibst weiter: einen aufgenommenen Test, dessen Locators du in Übung 2b mit einem schlechten Startcode vergleichst. · Zurückgefallen? → `git switch ex/01b-codegen` (Startpunkt mit den Lösungen aller früheren Übungen). Eine mögliche Aufnahme zeigt `git diff ex/01b-codegen ex/02-locators`.

**Codegen** öffnet einen Browser und schreibt mit, was du dort tust. Jeder Klick wird zu einer Zeile Testcode mit einem Locator, den Playwright selbst auswählt.

## Aufgaben

### Aufgabe 1 – App und Codegen starten
Starte die App in einem eigenen Terminal mit `npm run dev`. Starte in einem zweiten Terminal `npx playwright codegen http://localhost:3000`.

**Fertig, wenn:** zwei Fenster offen sind: der Browser mit der Startseite und der Playwright Inspector mit dem mitgeschriebenen Code.

<details><summary>Tipp</summary>
Codegen startet keinen Server, anders als `npx playwright test`. Läuft die App nicht, bleibt der Browser leer. In VS Code geht es auch ohne Terminal: Testing-Tab → „Record new“.
</details>

### Aufgabe 2 – Ablauf aufnehmen
Klicke im Browser auf „View Public News“, tippe „Playwright“ in das Suchfeld und wähle die Kategorie „Technology“.

**Fertig, wenn:** der Inspector je eine Zeile für `goto`, `click`, `fill` und `selectOption` zeigt.

### Aufgabe 3 – Assertions über die Toolbar ergänzen
Nutze in der Toolbar über dem Browser „Assert visibility“ für die Überschrift „News Feed“, „Assert value“ für das Suchfeld und „Assert text“ für den Trefferzähler („N articles found“).

**Fertig, wenn:** der Inspector drei `expect`-Zeilen enthält.

<details><summary>Tipp</summary>
Die Assertion-Buttons sitzen neben „Record“ in der schwebenden Toolbar. Nach dem Klick auf den Button klickst du das Element im Browser an.
</details>

### Aufgabe 4 – Test speichern und ausführen
Kopiere den Code nach `e2e/01b-codegen.spec.ts`. Ersetze `http://localhost:3000/` durch `/` (die `baseURL` steht in der Config) und führe den Test im UI Mode aus.

**Fertig, wenn:** `npx playwright test 01b-codegen --ui` den Test in allen drei Browsern grün zeigt.

<details><summary>Tipp</summary>
„Assert text“ schreibt die aktuelle Trefferzahl fest in den Test. Im Offline-Feed bleibt sie stabil. Mit `toHaveText(/\d+ articles? found/)` ist der Test unabhängig von der Zahl.
</details>

## Bonus (optional)
### Bonus A – Locator picken
Klicke im Inspector auf „Pick locator“ und zeige auf ein paar Elemente der News-Seite. Vergleiche die Vorschläge mit dem, was du in Übung 2 von Hand schreiben würdest. **Fertig, wenn:** du für den Theme-Umschalter einen Locator-Vorschlag gesehen hast.

## Wenn du nicht weiterkommst
Mögliche Aufnahme ansehen: `git diff ex/01b-codegen ex/02-locators` · oder `git switch ex/02-locators`.
