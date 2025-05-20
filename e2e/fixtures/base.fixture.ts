import { test as base } from '@playwright/test';

interface BaseFixtures {
  goToPage: (url: string) => Promise<void>;
}

export type UserOptions = {
  defaultUser: 'user1' | 'user2';
};

export const test = base.extend<BaseFixtures & UserOptions>({
  defaultUser: ['user1', { option: true }],

  goToPage: async ({ page }, use) => {
    await use(async (url: string) => {
      await page.goto(url);
      await page.waitForURL(url);
    });
  },
});
export const expect = test.expect;
