import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { NewsPage } from '../pages/NewsPage';

type PageFixtures = {
  homePage: HomePage;
  newsPage: NewsPage;
  loginPage: LoginPage;
};

/**
 * Page Objects als Fixtures (Übung 10b). Der Test nennt nur noch, was er braucht:
 * `async ({ newsPage }) => …`. Vorbereitung (z. B. Seite öffnen) steht vor `use()`.
 */
export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(await new HomePage(page).goto());
  },
  newsPage: async ({ page }, use) => {
    const newsPage = new NewsPage(page);
    await newsPage.goto();
    await use(newsPage);
  },
  loginPage: async ({ page }, use) => {
    await use(await new LoginPage(page).goto());
  },
});

export { expect } from '@playwright/test';
