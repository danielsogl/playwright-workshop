# Übung 14 – Clock API für zeitbasierte Tests

**Ziel:** Du lernst die Clock API zu nutzen, um zeitabhängige Features zu testen.

> **🧵 Roter Faden**
> **Nächster Winkel derselben App:** `/clock` – eigenständige Technik, kein Reuse nötig.
> **Zurückgefallen?** `git switch ex/14-clock` = Startpunkt dieser Übung, mit den Musterlösungen aller vorherigen Übungen. Die Musterlösung dieser Übung zeigt `git diff ex/14-clock ex/15-visual-regression`. Vollständig eigenständig. Die Musterlösung liegt in `e2e/14-clock.spec.ts` (der Dateiname weicht von dem in der Aufgabe ab).

**Website:** http://localhost:3000/clock (Clock & Timer Testing Page)

**Aufgaben:**

1. **Clock installieren und Zeit setzen:**

   ```typescript
   // e2e/clock-api.spec.ts
   test('Clock API - Zeit setzen', async ({ page }) => {
     // WICHTIG: Clock VOR page.goto() installieren!
     await page.clock.install({ time: new Date('2024-01-15 14:30:00') });

     await page.goto('/clock');

     // Zeit sollte in der Uhrzeitanzeige erscheinen
     await expect(page.getByTestId('current-time')).toContainText('14:30');
   });
   ```

2. **Zeit vorspulen mit fastForward:**

   ```typescript
   test('Zeit vorspulen', async ({ page }) => {
     await page.clock.install({ time: new Date('2024-01-15 10:00:00') });
     await page.goto('/clock');

     // Initial: 10:00
     await expect(page.getByTestId('current-time')).toContainText('10:00');

     // 2 Stunden vorspulen
     await page.clock.fastForward('02:00:00');

     // Sollte jetzt 12:00 anzeigen
     await expect(page.getByTestId('current-time')).toContainText('12:00');
   });
   ```

3. **Zeit pausieren und fortsetzen:**

   ```typescript
   test('Clock pausieren und fortsetzen', async ({ page }) => {
     await page.clock.install({ time: new Date('2024-01-15 15:00:00') });
     await page.goto('/clock');

     // Initial Zeit prüfen
     await expect(page.getByTestId('current-time')).toContainText('15:00');

     // Zeit 1 Stunde vorspulen
     await page.clock.fastForward('01:00:00');
     await expect(page.getByTestId('current-time')).toContainText('16:00');

     // Bei 16:15 pausieren (pauseAt springt nur vorwärts, nie in die Vergangenheit)
     await page.clock.pauseAt(new Date('2024-01-15 16:15:00'));

     // Zeit bleibt bei 16:15:00 stehen, die Sekunden laufen nicht weiter
     await expect(page.getByTestId('current-time')).toHaveText('16:15:00');

     // Zeit fortsetzen und nochmal vorspulen
     await page.clock.resume();
     await page.clock.fastForward('00:30:00');

     // Sollte jetzt 16:45 anzeigen
     await expect(page.getByTestId('current-time')).toContainText('16:45');
   });
   ```

4. **Bonus: `setFixedTime` und `runFor`:**

   ```typescript
   test('setFixedTime springt auf eine feste Zeit', async ({ page }) => {
     await page.clock.install({ time: new Date('2024-02-02T08:00:00') });
     await page.goto('/clock');
     await expect(page.getByTestId('current-time')).toContainText('08:00');

     // Date ist ab jetzt fix, die Timer der Seite laufen normal weiter
     await page.clock.setFixedTime(new Date('2024-02-02T09:15:00'));
     await expect(page.getByTestId('current-time')).toHaveText('09:15:00');
   });

   test('runFor lässt alle Timer der Reihe nach feuern', async ({ page }) => {
     await page.clock.install({ time: new Date('2024-01-15 10:00:00') });
     await page.goto('/clock');
     // Puffer von 5 Minuten: Das erste Laden der Seite (Dev-Server kompiliert) kostet echte Sekunden
     await page.clock.pauseAt(new Date('2024-01-15 10:05:00'));
     await expect(page.getByTestId('current-time')).toHaveText('10:05:00');

     await page.clock.runFor(2000);
     await expect(page.getByTestId('current-time')).toHaveText('10:05:02');
   });
   ```

   Hinweis: Setze `setFixedTime` nach dem Laden der Seite. Vor dem Laden fixiert es die Zeit schon beim Hydrieren, die Uhr der Seite zeigt dann die Server-Zeit, weil sich der Wert nie ändert.

**Clock API Methoden:**

- `page.clock.install({ time: new Date() })` - VOR page.goto() und vor allen anderen Clock-Aufrufen!
- `page.clock.fastForward('HH:MM:SS')` - Zeit vorspulen, fällige Timer feuern höchstens einmal
- `page.clock.runFor('MM:SS')` - Zeit vorspulen, alle Timer feuern der Reihe nach
- `page.clock.pauseAt(date)` - Zeit pausieren
- `page.clock.resume()` - Zeit weiterlaufen lassen
- `page.clock.setFixedTime(date)` - nur `Date` fixieren, Timer laufen normal weiter

**Best Practices:**

- ✅ Clock VOR Navigation installieren
- ✅ Web-first Assertions (`toHaveText`, `toContainText`) statt `waitForTimeout`
- ✅ Lesbare Zeitsprünge: `'02:30:00'` statt `9000000` (Zahl = Millisekunden)
- ⚠️ Ein String ohne Doppelpunkt zählt als **Sekunden**: `fastForward('08')` = 8 Sekunden
- ⚠️ `new Date('2024-01-15 14:30:00')` ist lokale Zeit, `new Date('2024-01-15T14:30:00Z')` ist UTC

**Zeit:** 30 Minuten

---

> **Tipp:** Die `/clock`-Seite nutzt `setInterval` für Uhrzeit, Session-Dauer und Countdown – perfekt für Clock API Tests. Mit `page.evaluate(() => Date.now())` liest du beim Debugging die aktuelle Mock-Zeit aus.
