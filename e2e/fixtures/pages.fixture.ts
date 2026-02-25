import { LoginPage } from '@/e2e/pom/login.pom';
import { NewsPage } from '@/e2e/pom/news.pom';
import { test as base } from '@playwright/test';

export const test = base.extend<{ pages: { loginPage: LoginPage, newsPage: NewsPage, } }>({
  pages: async ({ page }, use) => {
    await use({
      loginPage: new LoginPage(page),
      newsPage: new NewsPage(page),
    });
  }
});