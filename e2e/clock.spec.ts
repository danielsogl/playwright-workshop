import test from "@playwright/test";

test('Debugging mit Clock API', async ({ page }) => {
  await page.clock.install({ time: new Date('2024-02-02T10:00:00') });
  await page.goto('/');

  // Zeit im Test loggen
  const currentTime = await page.evaluate(() => new Date().toISOString());
  console.log('Aktuelle Browser-Zeit:', currentTime);
  // Output: 2024-02-02T10:00:00.000Z

  // Zeit vorspulen
  await page.clock.fastForward('01:30:00');

  const newTime = await page.evaluate(() => new Date().toISOString());
  console.log('Nach fastForward:', newTime);
  // Output: 2024-02-02T11:30:00.000Z
});