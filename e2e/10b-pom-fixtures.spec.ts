import { mergeTests } from '@playwright/test';
import { test as authTest } from './fixtures/auth.fixture';
import { test as pageTest, expect } from './fixtures/pages.fixture';

// Aufgabe 2 kommt mit `pageTest` aus. Bonus A kombiniert ihn mit der Auth-Fixture aus Übung 8.
const test = mergeTests(pageTest, authTest);

test.describe('Übung 10b - Page Objects als Fixtures', () => {
  test('Suche nach einem Titel findet genau diesen Artikel', async ({
    newsPage,
  }) => {
    const title = (await newsPage.getFirstNewsTitle()) ?? '';
    await newsPage.searchNews(title);
    await expect(newsPage.newsItems).toHaveCount(1);
    await expect(newsPage.newsTitles.first()).toHaveText(title);
  });

  test('Kategorie-Filter zeigt nur Technology', async ({ newsPage }) => {
    await newsPage.filterByCategory('Technology');
    await expect(newsPage.newsItems.first()).toBeVisible();
    await expect(
      newsPage.newsItems.filter({ hasNotText: 'Technology' }),
    ).toHaveCount(0);
  });

  test('Login mit falschen Daten zeigt einen Fehler', async ({ loginPage }) => {
    await loginPage.login('wrong@example.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.page).toHaveURL(/auth\/signin/);
  });

  test('Bonus A: eingeloggt erreichst du die Private News', async ({
    authenticatedPage,
    homePage,
  }) => {
    await homePage.navigateTo('Private News');
    await expect(authenticatedPage).toHaveURL(/\/news\/private/);
  });
});
