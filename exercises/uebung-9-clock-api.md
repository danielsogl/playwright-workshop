# Übung 9 – Clock API für zeitbasierte Tests mit ClockTab.com

**Ziel:** Du lernst die Clock API zu nutzen, um zeitabhängige Features zu testen.

**Website:** http://localhost:3000/clock (Clock & Timer Testing Page)

**Aufgaben:**

1. **Clock installieren und Zeit setzen:**

   ```typescript
   // e2e/clock-api.spec.ts
   test('Clock API - Zeit setzen', async ({ page }) => {
     // WICHTIG: Clock VOR page.goto() installieren!
     await page.clock.install({ time: new Date('2024-01-15 14:30:00') });

     await page.goto('/clock');
     await page.waitForLoadState('networkidle');

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

     // Zeit 1 Stunde vorspulen und dann pausieren
     await page.clock.fastForward('01:00:00');
     await page.clock.pauseAt(new Date('2024-01-15 16:00:00'));

     // Zeit sollte bei 16:00 pausiert bleiben
     await page.waitForTimeout(2000);
     await expect(page.getByTestId('current-time')).toContainText('16:00');

     // Zeit fortsetzen und nochmal vorspulen
     await page.clock.resume();
     await page.clock.fastForward('00:30:00');

     // Sollte jetzt 16:30 anzeigen
     await expect(page.getByTestId('current-time')).toContainText('16:30');
   });
   ```

**Clock API Methoden:**

- `page.clock.install({ time: new Date() })` - VOR page.goto()!
- `page.clock.fastForward('HH:MM:SS')` - Zeit vorspulen
- `page.clock.pauseAt(date)` - Zeit pausieren

**Best Practices:**

- ✅ Clock VOR Navigation installieren
- ✅ `waitForLoadState('networkidle')` verwenden
- ✅ Realistische Zeitsprünge (nicht zu schnell)
- ✅ Verschiedene Zeitformate testen

**Zeit:** 30 Minuten

---

> **Tipp:** ClockTab.com nutzt JavaScript Timer - perfekt für Clock API Tests!
