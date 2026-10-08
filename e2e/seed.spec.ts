import { test, expect } from '@playwright/test';

/**
 * Seed-Test für die Playwright Test Agents (Übung 18).
 *
 * Der Planner führt diese Datei vor dem Explorieren aus. Sie legt fest, wie ein
 * generierter Test *startet* – Fixtures, Auth, Start-URL. Der Generator nutzt sie
 * als Vorlage für jeden neuen Test.
 *
 * Für authentifizierte Flows: hier die `authenticatedPage`-Fixture aus Übung 8
 * importieren statt der nackten `page`.
 */
test('seed', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Playwright Demo/);
});
