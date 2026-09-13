import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Exercise 9: Page Object Pattern', () => {
  test('News-Suche mit Page Object', async ({ page }) => {
    // Navigation über Page Objects: Seitenwechsel liefert das nächste Page Object
    const homePage = await new HomePage(page).goto();
    const newsPage = await homePage.navigateToNews();

    // Bereitschaft per Web-First-Assertion prüfen
    await newsPage.waitForNewsItems();

    // Helper-Methoden für Werte, die wir weiterverwenden
    const initialCount = await newsPage.getNewsCount();
    expect(initialCount).toBeGreaterThan(0);
    // Suchbegriff aus den Daten: läuft mit Live- und Offline-Feeds
    const firstTitle = (await newsPage.getFirstNewsTitle())?.trim() ?? '';

    // Suche durchführen und über Locators prüfen (wartet automatisch)
    await newsPage.searchNews(firstTitle);
    await expect(newsPage.newsTitles.first()).toHaveText(firstTitle);

    // Suche zurücksetzen: wieder alle Artikel
    await newsPage.clearSearch();
    await expect(newsPage.newsItems).toHaveCount(initialCount);
  });

  test('Login mit Page Object', async ({ page }) => {
    const loginPage = await new LoginPage(page).goto();

    // Versuche leeren Login
    await loginPage.submitEmptyForm();
    await expect(page).toHaveURL(/auth\/signin/);

    // Login mit falschen Daten
    await loginPage.login('wrong@example.com', 'wrongpassword');

    // Fehlermeldung erscheint, wir bleiben auf der Login-Seite
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/auth\/signin/);
  });

  test('Navigation zwischen Seiten mit Page Objects', async ({ page }) => {
    const homePage = await new HomePage(page).goto();

    await homePage.navigateTo('Clock');
    await expect(page).toHaveURL('/clock');

    await homePage.navigateTo('File Download');
    await expect(page).toHaveURL('/file-download');

    await homePage.navigateTo('Fixtures Demo');
    await expect(page).toHaveURL('/fixtures-demo');

    // Zurück zur Startseite
    await homePage.navigateToHome();
    await expect(page).toHaveURL('/');
  });

  test('Kompletter User Flow mit Page Objects', async ({ page }) => {
    // Start auf Homepage, weiter zu News
    const homePage = await new HomePage(page).goto();
    const newsPage = await homePage.navigateToNews();
    await newsPage.waitForNewsItems();

    // Suche ohne Treffer
    await newsPage.searchNews('zzz-kein-treffer-xyz');
    await expect(newsPage.newsItems).toHaveCount(0);
    await expect(newsPage.resultsCount).toHaveText('0 articles found');

    // Gehe über die Navigation zur Login-Seite
    const loginPage = await homePage.navigateToSignIn();
    await loginPage.login('wrong@example.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();

    // Zurück zu News
    await newsPage.goto();
    await expect(newsPage.newsTitles.first()).not.toBeEmpty();
  });
});
