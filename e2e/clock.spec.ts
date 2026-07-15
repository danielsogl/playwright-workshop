import { test, expect } from "@/e2e/fixtures/base.fixture";


test('Clock display shows correct time', async ({ page }) => {
  const testTime = new Date('2024-01-15 14:30:00');
  await page.clock.install({ time: testTime });

  await page.goto('/clock');
  await page.waitForLoadState('networkidle');

  await expect(page.getByTestId('current-time')).toContainText('14:30');

  await page.clock.fastForward('01:30:00');
  await expect(page.getByTestId('current-time')).toContainText('16:00');
});
