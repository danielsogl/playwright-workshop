import { test as base, expect } from '@playwright/test';

interface Fixtures {
  userManagementPage: {
    addUser: (user: { name: string; email: string }) => Promise<void>;
  }
}

export const userManagementFixture = base.extend<Fixtures>({
  userManagementPage: async ({ page }, use,) => {
    await use({
      addUser: async (user: { name: string; email: string }) => {
        await page.goto('/fixture-demo');

        const { email, name } = user;
        // fill the form

        expect(page.getByText(name)).toBeVisible();
      },
    });
  }
});
