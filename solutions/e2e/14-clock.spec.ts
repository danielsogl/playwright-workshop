/**
 * Exercise 14 - Clock API for Internal Clock Page Testing Solution
 *
 * This test suite demonstrates time-based testing using Playwright's Clock API
 * with the internal demo application clock page at /clock.
 *
 * Key learning points:
 * - Install clock before navigation with page.clock.install()
 * - Control time progression with fastForward()
 * - Test time-dependent displays without waiting
 * - Use pauseAt() and resume() for time control
 */

import { test, expect } from '@playwright/test';

test.describe('Exercise 14: Clock API Testing', () => {
  test('Clock display shows correct time', async ({ page }) => {
    // WICHTIG: Clock installieren VOR page.goto()!
    const testTime = new Date('2024-01-15 14:30:00');
    await page.clock.install({ time: testTime });

    await page.goto('/clock');

    // Zeit sollte in der Uhrzeitanzeige erscheinen
    await expect(page.getByTestId('current-time')).toContainText('14:30');
  });

  test('Clock updates when time advances', async ({ page }) => {
    await page.clock.install({ time: new Date('2024-01-15 10:00:00') });

    await page.goto('/clock');

    // Initial: 10:00
    await expect(page.getByTestId('current-time')).toContainText('10:00');

    // Zeit 2 Stunden vorspulen
    await page.clock.fastForward('02:00:00');

    // Sollte jetzt 12:00 anzeigen
    await expect(page.getByTestId('current-time')).toContainText('12:00');
  });

  test('Session duration updates with time progression', async ({ page }) => {
    await page.clock.install({ time: new Date('2024-01-15 09:00:00') });

    await page.goto('/clock');

    // Erst wenn die Uhr die installierte Zeit zeigt, ist die Seite hydriert und die Session gestartet
    await expect(page.getByTestId('current-time')).toContainText('09:00');

    // Initial session duration sollte 0:00 sein
    await expect(page.getByTestId('session-duration')).toHaveText(/^0:\d\d$/); // Sekunden laufen in Echtzeit, geprüft wird die Minute

    // 5 Minuten vorspulen
    await page.clock.fastForward('05:00');

    // Session duration sollte 5:00 anzeigen
    await expect(page.getByTestId('session-duration')).toHaveText(/^5:\d\d$/);

    // Weitere 10 Minuten vorspulen
    await page.clock.fastForward('10:00');

    // Session duration sollte 15:00 anzeigen
    await expect(page.getByTestId('session-duration')).toHaveText(/^15:\d\d$/);
  });

  test('Countdown timer functionality', async ({ page }) => {
    await page.clock.install({ time: new Date('2024-01-15 12:00:00') });

    await page.goto('/clock');

    // 1-Minuten Timer starten
    await page.getByTestId('start-1min-timer').click();

    // Der Countdown erscheint nach dem ersten Tick knapp unter 1:00
    const countdown = page.getByTestId('countdown-display');
    await expect(countdown).toHaveText(/^0:5\d$/);

    // 30 Sekunden vorspulen
    await page.clock.fastForward('00:30');

    // Countdown sollte sich um ~30 Sekunden reduziert haben (mit etwas Toleranz)
    await expect(countdown).toHaveText(/^0:2\d$/);
  });

  test('Christmas message appears on December 25th', async ({ page }) => {
    // Set time to Christmas Day
    await page.clock.install({ time: new Date('2024-12-25 10:00:00') });

    await page.goto('/clock');

    // Christmas message should be visible
    await expect(page.getByTestId('christmas-message')).toBeVisible();
    await expect(page.getByTestId('christmas-message')).toContainText(
      'Frohe Weihnachten',
    );
  });

  test('New Year message appears on December 31st', async ({ page }) => {
    // Set time to New Year's Eve
    await page.clock.install({ time: new Date('2024-12-31 23:00:00') });

    await page.goto('/clock');

    // New Year message should be visible
    await expect(page.getByTestId('newyear-message')).toBeVisible();
    await expect(page.getByTestId('newyear-message')).toContainText(
      'Frohes neues Jahr',
    );
  });

  test('Pause and resume clock functionality', async ({ page }) => {
    await page.clock.install({ time: new Date('2024-01-15 15:00:00') });

    await page.goto('/clock');

    // Initial Zeit prüfen
    await expect(page.getByTestId('current-time')).toContainText('15:00');

    // Zeit 1 Stunde vorspulen
    await page.clock.fastForward('01:00:00');
    await expect(page.getByTestId('current-time')).toContainText('16:00');

    // Zeit bei 16:15 pausieren
    await page.clock.pauseAt(new Date('2024-01-15 16:15:00'));

    // Zeit bleibt bei 16:15:00 stehen, die Sekunden laufen nicht weiter
    await expect(page.getByTestId('current-time')).toHaveText('16:15:00');

    // Zeit fortsetzen und nochmal vorspulen
    await page.clock.resume();
    await page.clock.fastForward('00:30:00');

    // Sollte jetzt 16:45 anzeigen
    await expect(page.getByTestId('current-time')).toContainText('16:45');
  });

  test('Last updated timestamp reflects current time', async ({ page }) => {
    await page.clock.install({ time: new Date('2024-01-15 11:45:00') });

    await page.goto('/clock');

    // "Zuletzt aktualisiert" sollte aktuelle Zeit zeigen
    await expect(page.getByTestId('last-updated')).toContainText('11:45');

    // Zeit vorspulen
    await page.clock.fastForward('00:15:00');

    // "Zuletzt aktualisiert" sollte neue Zeit zeigen
    await expect(page.getByTestId('last-updated')).toContainText('12:00');
  });
});
