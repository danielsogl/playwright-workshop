import { test, expect } from '@playwright/test';
import { NewsPage } from '../pages/NewsPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Exercise 9: Page Object Pattern', () => {
  let newsPage: NewsPage;
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Initialisiere Page Objects
    newsPage = new NewsPage(page);
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
  });

  test('News-Suche mit Page Object', async () => {
    // Navigation über Page Object
    await homePage.goto();
    await homePage.navigateToNews();

    // Warte auf News-Liste
    await newsPage.waitForNewsItems();

    // Initiale Anzahl
    const initialCount = await newsPage.getNewsCount();
    expect(initialCount).toBeGreaterThan(0);

    // Suche durchführen
    await newsPage.searchNews('Technology');

    // Prüfe gefilterte Ergebnisse
    const filteredCount = await newsPage.getNewsCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    // Suche zurücksetzen
    await newsPage.clearSearch();

    // Sollte wieder alle zeigen
    const resetCount = await newsPage.getNewsCount();
    expect(resetCount).toBeGreaterThanOrEqual(initialCount - 5);
  });

  test('Login mit Page Object', async () => {
    // Navigation zur Login-Seite
    await loginPage.goto();

    // Versuche leeren Login
    await loginPage.submitEmptyForm();
    await expect(loginPage.page).toHaveURL(/auth\/signin/);

    // Login mit falschen Daten
    await loginPage.login('wrong@example.com', 'wrongpassword');

    // Prüfe auf Fehler oder dass wir noch auf Login-Seite sind
    await expect(loginPage.page).toHaveURL(/auth\/signin/);

    // Skip the successful login test as we don't have valid credentials
    // In a real app, you would use test credentials from environment variables
  });

  test('Navigation zwischen Seiten mit Page Objects', async ({ page }) => {
    await homePage.goto();

    // Navigiere zu About
    await homePage.navigateToAbout();
    await expect(page).toHaveURL('/about');

    // Navigiere zu Blog
    await homePage.navigateToBlog();
    await expect(page).toHaveURL('/blog');

    // Navigiere zu Pricing
    await homePage.navigateToPricing();
    await expect(page).toHaveURL('/pricing');

    // Zurück zur Startseite
    await homePage.navigateToHome();
    await expect(page).toHaveURL('/');
  });

  test('Kompletter User Flow mit Page Objects', async () => {
    // Start auf Homepage
    await homePage.goto();

    // Gehe zu News
    await homePage.navigateToNews();
    await newsPage.waitForNewsItems();

    // Suche nach Artikeln
    await newsPage.searchNews('Playwright');
    const searchResults = await newsPage.getNewsCount();
    console.log(`Found ${searchResults} articles about Playwright`);

    // Gehe zur Login-Seite
    await loginPage.goto();

    // Führe Login durch
    await loginPage.login('test@example.com', 'password123');

    // Zurück zu News (als eingeloggter Benutzer)
    await newsPage.goto();
    const titles = await newsPage.getNewsTitles();
    console.log('First 3 news titles:', titles.slice(0, 3));
  });
});
