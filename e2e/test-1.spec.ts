import { test, expect } from '@playwright/test';

test('Aufruf einer Page', async ({ page }) => {
  await page.goto('/login');
});