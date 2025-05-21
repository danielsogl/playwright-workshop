import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test('Lighthouse Performance Test', async ({
  browserName,
  playwright,
  page,
}) => {
  if (browserName !== 'chromium') {
    return;
  }

  const browser = await playwright.chromium.launch({
    args: ['--remote-debugging-port=9222'],
  });
  await page.goto('https://playwright.dev/');

  await playAudit({
    page: page,
    port: 9222,
    thresholds: {
      performance: 90,
      accessibility: 90,
      'best-practices': 90,
      seo: 80,
    },
  });

  await browser.close();
});
