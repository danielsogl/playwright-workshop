# Übung 14 – Clock API für zeitbasierte Tests

**Ziel:** Du lernst die Clock API zu nutzen, um zeitabhängige Features zu testen.

> **🧵 Roter Faden**
> **Nächster Winkel derselben App:** `/clock` – eigenständige Technik, kein Reuse nötig.
> **Zurückgefallen?** Vollständig eigenständig.

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
