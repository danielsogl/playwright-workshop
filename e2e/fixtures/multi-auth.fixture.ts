import { test as base, type Page } from '@playwright/test';
import path from 'path';

const authDir = path.join(import.meta.dirname, '../../../playwright/.auth');

type AuthFixtures = {
  userPage: Page;
  adminPage: Page;
};

export const multiAuthFixture = base.extend<AuthFixtures>({
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(authDir, 'user.json'),
    });
    await use(await context.newPage());
    await context.close();
  },
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(authDir, 'admin.json'),
    });
    await use(await context.newPage());
    await context.close();
  },
});
