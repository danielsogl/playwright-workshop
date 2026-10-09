# Übung 14 – Clock API für zeitbasierte Tests

**Ziel:** Du steuerst mit der Clock API die Uhrzeit der Seite und testest Zeitanzeigen, ohne zu warten.
**Zeit:** 30 Min. (Pflicht) · Bonus: +10 Min. · **Startbranch:** `git switch ex/14-clock` · **Datei:** `e2e/14-clock.spec.ts`

> Roter Faden: Baut auf nichts Bestimmtem auf, die Übung ist eigenständig (neue Seite `/clock`) · Du gibst weiter: die Technik, Zeit in Tests zu kontrollieren · Zurückgefallen? `git switch ex/14-clock` (Startbranch enthält die Lösungen aller früheren Übungen, nicht die von Übung 14). Musterlösung: `git diff ex/14-clock ex/15-visual-regression`.

## Vorbereitung

Die Seite http://localhost:3000/clock zeigt Uhrzeit, Session-Dauer und Countdown. Sie nutzt `setInterval`, also Timer, die sich selbst wiederholen. Die Uhrzeit hat die Test-ID `current-time` und das Format `HH:MM:SS`.

Die **Clock API** ersetzt `Date` und die Timer (`setTimeout`, `setInterval`) der Seite durch eine Test-Uhr, die du steuerst. Datumsangaben ohne `Z` (`new Date('2024-01-15 14:30:00')`) sind lokale Zeit. Die Config setzt keine `timezoneId`, deshalb zeigt die Seite genau diese Uhrzeit an.

Lege `e2e/14-clock.spec.ts` an und schreibe die Tests selbst.

## Aufgaben

### Aufgabe 1 – Clock installieren und Zeit setzen
Schreibe einen Test, der die Uhr auf den 15.01.2024, 14:30 Uhr setzt und die Seite `/clock` öffnet. Die Uhrzeitanzeige soll diese Zeit zeigen.
**Fertig, wenn:** der Test grün ist und `current-time` den Text `14:30` enthält.
<details><summary>Tipp</summary>

`page.clock.install({ time: … })` muss **vor** `page.goto()` stehen, sonst läuft die Seite schon mit der echten Zeit. Prüfen mit `toContainText`.
</details>

### Aufgabe 2 – Zeit vorspulen
Starte die Uhr bei 10:00, prüfe `10:00` und spule dann 2 Stunden vor.
**Fertig, wenn:** der Test grün ist und `current-time` nach dem Vorspulen `12:00` enthält.
<details><summary>Tipp</summary>

`page.clock.fastForward('02:00:00')`. Das Format ist `HH:MM:SS`. Ein String ohne Doppelpunkt zählt als **Sekunden** (`'08'` = 8 Sekunden), eine Zahl als Millisekunden.
</details>

### Aufgabe 3 – Pausieren und fortsetzen
Starte bei 15:00, spule 1 Stunde vor (`16:00`), halte die Uhr bei 16:15:00 an und prüfe, dass die Anzeige stehen bleibt. Setze die Uhr fort, spule 30 Minuten vor und prüfe `16:45`.
**Fertig, wenn:** der Test grün ist, die Anzeige nach dem Pausieren genau `16:15:00` zeigt (`toHaveText`) und am Ende `16:45` enthält.
<details><summary>Tipp</summary>

`page.clock.pauseAt(new Date(…))` springt zur Zeit und hält die Uhr an. Es springt nur **vorwärts**: Eine Zeit in der Vergangenheit endet mit „Cannot fast-forward to the past". `page.clock.resume()` lässt die Zeit wieder laufen.
</details>

Alle drei Tests: `npx playwright test e2e/14-clock.spec.ts --project=chromium` meldet keine `failed`. Das Auth-Setup aus Übung 7 läuft vorher mit und wird zusätzlich gezählt, deine drei Tests sind alle grün.

## Bonus (optional)

### Bonus A – `setFixedTime`
Starte um 08:00 (`2024-02-02T08:00:00`), öffne `/clock`, prüfe `08:00`. Rufe danach `setFixedTime` mit 09:15:00 auf. Die Anzeige soll `09:15:00` zeigen.
**Fertig, wenn:** `current-time` den Text `09:15:00` hat. `setFixedTime` ändert nur `Date`, die Timer der Seite laufen weiter und zeichnen die Uhr neu. Rufe es **nach** dem Laden auf: Davor liest die Seite beim Start eine feste Zeit und zeichnet die Uhr nicht neu.

### Bonus B – `runFor`
Starte um 10:00, öffne `/clock`, pausiere bei 10:05:00 und prüfe `10:05:00`. Rufe dann `runFor(2000)` auf. Erwartet: `10:05:02`.
**Fertig, wenn:** `current-time` den Text `10:05:02` hat.
Hintergrund: `fastForward` springt direkt zum Ziel, ein sekündlicher Timer feuert dabei **höchstens einmal**, auch wenn viele Sekunden vergangen sind. `runFor` lässt die Zeit simuliert ablaufen, jeder Timer feuert so oft, wie er fällig wäre. Der Puffer von 5 Minuten bei `pauseAt` ist nötig: Beim ersten Aufruf kompiliert der Dev-Server die Seite, das dauert echte Sekunden, und `pauseAt` springt nie zurück.

## Wenn du nicht weiterkommst
Musterlösung ansehen: `git diff ex/14-clock ex/15-visual-regression` · oder `git switch ex/15-visual-regression`.
