import { LoginPage } from '@/e2e/pom/login.pom';
import { PublicNewsPage } from '@/e2e/pom/public-news.pom';
import { test as base } from '@playwright/test';

export const pagesFixture = base.extend<{
  loginPage: LoginPage;
  publicNewsPage: PublicNewsPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  publicNewsPage: async ({ page }, use) => {
    const publicNewsPage = new PublicNewsPage(page);
    await use(publicNewsPage);
  },
});
