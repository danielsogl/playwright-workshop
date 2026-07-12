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
    await page.waitForLoadState('networkidle');

    // Zeit sollte in der Uhrzeitanzeige erscheinen
    await expect(page.getByTestId('current-time')).toContainText('14:30');
  });

  test('Clock updates when time advances', async ({ page }) => {
    await page.clock.install({ time: new Date('2024-01-15 10:00:00') });

    await page.goto('/clock');
    await page.waitForLoadState('networkidle');

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
    await page.waitForLoadState('networkidle');

    // Initial session duration sollte 0:00 sein
    await expect(page.getByTestId('session-duration')).toContainText('0:00');

    // 5 Minuten vorspulen
    await page.clock.fastForward('05:00');

    // Session duration sollte 5:00 anzeigen
    await expect(page.getByTestId('session-duration')).toContainText('5:00');

    // Weitere 10 Minuten vorspulen
    await page.clock.fastForward('10:00');

    // Session duration sollte 15:00 anzeigen
    await expect(page.getByTestId('session-duration')).toContainText('15:00');
  });

  test('Countdown timer functionality', async ({ page }) => {
    await page.clock.install({ time: new Date('2024-01-15 12:00:00') });

    await page.goto('/clock');
    await page.waitForLoadState('networkidle');

    // 1-Minuten Timer starten
    await page.getByTestId('start-1min-timer').click();

    // Warten bis Countdown-Timer erscheint (könnte leicht unter 1:00 starten)
    await expect(page.getByTestId('countdown-display')).toBeVisible();

    // Countdown sollte bei ungefähr 1:00 oder etwas darunter sein
    const initialCountdown = await page
      .getByTestId('countdown-display')
      .textContent();
    expect(initialCountdown).toMatch(/0:(5[0-9]|[0-5][0-9])/); // Zwischen 0:00 und 0:59

    // 30 Sekunden vorspulen
    await page.clock.fastForward('00:30');

    // Countdown sollte sich um ~30 Sekunden reduziert haben
    const afterThirtySeconds = await page
      .getByTestId('countdown-display')
      .textContent();
    const initialSeconds = parseInt(initialCountdown?.split(':')[1] || '0');
    const newSeconds = parseInt(afterThirtySeconds?.split(':')[1] || '0');

    // Sollte um ca. 30 Sekunden weniger sein (mit etwas Toleranz)
    expect(Math.abs(initialSeconds - newSeconds - 30)).toBeLessThan(5);
  });

  test('Christmas message appears on December 25th', async ({ page }) => {
    // Set time to Christmas Day
    await page.clock.install({ time: new Date('2024-12-25 10:00:00') });

    await page.goto('/clock');
    await page.waitForLoadState('networkidle');

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
    await page.waitForLoadState('networkidle');

    // New Year message should be visible
    await expect(page.getByTestId('newyear-message')).toBeVisible();
    await expect(page.getByTestId('newyear-message')).toContainText(
      'Frohes neues Jahr',
    );
  });

  test('Pause and resume clock functionality', async ({ page }) => {
    await page.clock.install({ time: new Date('2024-01-15 15:00:00') });

    await page.goto('/clock');
    await page.waitForLoadState('networkidle');

    // Initial Zeit prüfen
    await expect(page.getByTestId('current-time')).toContainText('15:00');

    // Zeit 1 Stunde vorspulen
    await page.clock.fastForward('01:00:00');
    await expect(page.getByTestId('current-time')).toContainText('16:00');

    // Zeit bei 16:15 pausieren
    await page.clock.pauseAt(new Date('2024-01-15 16:15:00'));

    // Zeit sollte bei 16:15 pausiert bleiben
    await page.waitForTimeout(2000);
    await expect(page.getByTestId('current-time')).toContainText('16:15');

    // Zeit fortsetzen und nochmal vorspulen
    await page.clock.resume();
    await page.clock.fastForward('00:30:00');

    // Sollte jetzt 16:45 anzeigen
    await expect(page.getByTestId('current-time')).toContainText('16:45');
  });

  test('Last updated timestamp reflects current time', async ({ page }) => {
    await page.clock.install({ time: new Date('2024-01-15 11:45:00') });

    await page.goto('/clock');
    await page.waitForLoadState('networkidle');

    // "Zuletzt aktualisiert" sollte aktuelle Zeit zeigen
    await expect(page.getByTestId('last-updated')).toContainText('11:45');

    // Zeit vorspulen
    await page.clock.fastForward('00:15:00');

    // "Zuletzt aktualisiert" sollte neue Zeit zeigen
    await expect(page.getByTestId('last-updated')).toContainText('12:00');
  });
});
