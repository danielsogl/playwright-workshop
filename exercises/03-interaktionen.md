# Übung 3 – Interaktionen in der Feed App

**Ziel:** Du testest Benutzer-Aktionen wie Klicks, Eingaben, Auswahllisten und Tastatur in vier eigenen Tests.
**Zeit:** 30 Min. (Pflicht) · Bonus: +5 Min. · **Startbranch:** `git switch ex/03-interaktionen` · **Datei:** `e2e/03-interaktionen.spec.ts`

> Roter Faden: Baut auf: Übung 2, dieselben Elemente (Theme-Umschalter, Suche), jetzt interaktiv. · Du gibst weiter: Interaktions-Muster (`click`, `fill`, `keyboard`) und den Login-Flow, den Übung 7 zum Auth-Setup ausbaut. · Zurückgefallen? → `git switch ex/03-interaktionen` (Startpunkt mit den Lösungen aller früheren Übungen). Die Musterlösung zeigt `git diff ex/03-interaktionen ex/04-erster-test`. Übung 2 ist keine harte Voraussetzung.

Feste Zahlen (20 Artikel, 5 in „Business“) gelten nur mit dem Offline-Feed (`RSS_OFFLINE_MODE=true` in deiner `.env`, siehe Übung 1).

Lege `e2e/03-interaktionen.spec.ts` an. Packe die vier Tests in einen gemeinsamen `test.describe`-Block. Die Tests sind von eng angeleitet bis offen geordnet.

## Aufgaben

### Aufgabe 1 – Theme umschalten
Öffne `/`. Der Theme-Umschalter hat die Rolle `switch` und einen Namen mit „dark“ oder „light“ (es gibt ihn für Desktop und Mobile, `.visible()` nimmt den sichtbaren). Merke dir die `class` des `<html>`-Elements, klicke den Umschalter, prüfe, dass sich die Klasse geändert hat, klicke erneut und prüfe, dass sie wieder die alte ist.

**Fertig, wenn:** der Test grün ist.

<details><summary>Tipp</summary>
Locator für `<html>`: `page.locator('html')`. Klasse lesen: `getAttribute('class')`. Zum Vergleich `expect(html).not.toHaveClass(alt)` und `toHaveClass(alt)`. Diese Assertions warten selbst, du brauchst keine Pause.
</details>

### Aufgabe 2 – Kategorie filtern
Öffne `/news/public`. Prüfe, dass im Feed (`role="feed"`, Name „News articles“) 20 Artikel stehen. Wähle in der Auswahlliste „Filter news by category“ die Kategorie „Business“. Prüfe danach den Text „5 articles found“ und dass 5 Artikel übrig sind.

**Fertig, wenn:** der Test grün ist.

<details><summary>Tipp</summary>
Ein `<select>` hat die Rolle `combobox`. `selectOption('Business')` wählt per Label. Für die Anzahl: `toHaveCount()`. Den Text suchst du mit `getByText('5 articles found', { exact: true })`.
</details>

### Aufgabe 3 – Suche per Tastatur
Öffne `/news/public` und warte, bis die Artikel da sind. Bringe den Fokus nur mit der Tastatur ins Suchfeld („Search news articles“), tippe „Playwright“ mit echten Tastenanschlägen und drücke Enter. Prüfe vorher, dass das Suchfeld fokussiert ist. Prüfe am Ende, dass keine Artikel mehr übrig sind.

**Fertig, wenn:** der Test grün ist und nach der Suche 0 Artikel (Text „0 articles found“) sichtbar sind.

<details><summary>Tipp</summary>
Vom Seitenanfang aus liegen Skip-Link und Navbar vor dem Suchfeld, du bräuchtest viele `Tab`-Schritte. Klicke stattdessen die Überschrift „News Feed“ an: Der Fokus startet dann direkt davor, ein `page.keyboard.press('Tab')` reicht. Fokus prüfst du mit `toBeFocused()`, Tasten tippst du mit `pressSequentially()`.
</details>

### Aufgabe 4 – Login-Formular
Öffne `/auth/signin`. Das Feld „Email“, das Feld „Password“ und der Button (Name „Submit sign in form“) sind per Label bzw. Rolle erreichbar. Teste der Reihe nach:
1. leeres Formular absenden: du bleibst auf `/auth/signin`, es erscheint keine Fehlermeldung (die Felder sind Pflichtfelder, der Browser hält das Absenden an),
2. nur E-Mail ausfüllen und absenden: du bleibst auf `/auth/signin`,
3. falsches Passwort absenden: die Fehlermeldung „Invalid email or password“ erscheint,
4. Zugangsdaten aus `.env` (`TEST_USER_EMAIL` / `TEST_USER_PASSWORD`) eintragen und absenden: du landest nicht mehr auf `/auth/signin`.

**Fertig, wenn:** der Test grün ist.

<details><summary>Tipp</summary>
Die Fehlermeldung hat `role="alert"`. Der Next.js Route Announcer hat ebenfalls `role="alert"`, filtere deshalb mit `getByRole('alert').filter({ hasText: … })`. Die Werte aus der `.env` liest du mit `process.env.TEST_USER_EMAIL`. URL prüfst du mit `toHaveURL()` bzw. `not.toHaveURL()`.
</details>

### Alles zusammen
Führe `npx playwright test e2e/03-interaktionen.spec.ts` aus.

**Fertig, wenn:** 4 Tests × 3 Browser = `12 passed` angezeigt werden.

## Bonus (optional)
### Bonus A – Debuggen mit `page.pause()`
Setze `await page.pause()` in einen deiner Tests und starte ihn mit `--debug`. Der Inspector zeigt dir Schritt für Schritt, was ausgeführt wird. Entferne die Zeile danach wieder. **Fertig, wenn:** du den Test im Inspector durchgeklickt hast.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/03-interaktionen ex/04-erster-test` · oder `git switch ex/04-erster-test`.
