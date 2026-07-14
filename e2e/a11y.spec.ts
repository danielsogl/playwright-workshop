import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Seite ist barrierefrei", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('Seite erfüllt WCAG 2.1 AA Standards', async ({ page }) => {
  await page.goto("/");
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
