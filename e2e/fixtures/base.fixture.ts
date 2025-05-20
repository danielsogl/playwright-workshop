import { test as base } from '@playwright/test';
import { LoginPage } from '../pom/login.pom';
import { NewsFeedPage } from '../pom/news-feed.pom';

interface BaseFixtures {
  goToPage: (url: string) => Promise<void>;
  loginPage: LoginPage;
  newsFeedPage: NewsFeedPage;
}

export type UserOptions = {
  defaultUser: 'user1' | 'user2';
};

export const test = base.extend<BaseFixtures & UserOptions>({
  defaultUser: ['user1', { option: true }],

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  newsFeedPage: async ({ page }, use) => {
    await use(new NewsFeedPage(page));
  },

  goToPage: async ({ page }, use) => {
    await use(async (url: string) => {
      await page.goto(url);
      await page.waitForURL(url);
    });
  },
});
export const expect = test.expect;
