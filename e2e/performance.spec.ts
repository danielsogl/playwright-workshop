import { expect, test } from '@playwright/test';

test('Navigation Performance messen', async ({ page }) => {
  await page.goto('https://google.com');

  const navigationTiming = await page.evaluate(() =>
    performance.getEntriesByType('navigation'),
  );

  console.log(navigationTiming);

  expect(navigationTiming[0].duration).toBeLessThan(1000);
});
