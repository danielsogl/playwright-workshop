import { test as base, expect } from '@playwright/test';

export const authFixture = base.extend<{
  loginPageOld: {
    login: (email: string, password: string) => Promise<void>
  }
}>({
  loginPageOld: async ({ page }, use) => {
    await use({
      login: async (email: string, password: string) => {
        await page.goto('/auth/signin');

        await page.getByLabel('Email').fill(email);
        await page.getByLabel('Password').fill(password);
        await page.getByRole('button', { name: 'Submit sign in form' }).click();

        await page.waitForURL('/');
        await expect(page.getByRole('button', { name: 'User profile actions menu' })).toBeVisible();
      }
    });
  }
});
