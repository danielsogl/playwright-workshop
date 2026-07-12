import { test, expect } from '@playwright/test';

test.describe('Übung 2 - Locators kennenlernen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('verschiedene Locator-Strategien verwenden', async ({ page }) => {
    // 1. Den "Public News" Link mit getByRole() finden
    const publicNewsLink = page.getByRole('link', { name: /view public news/i });
    console.log('Public News link gefunden:', await publicNewsLink.isVisible());

    // Navigation zur News-Seite für weitere Tests
    await publicNewsLink.click();
    await page.waitForLoadState('networkidle');

    // 2. Die Überschrift "News Feed" mit getByText() finden
    const heading = page.getByText('News Feed');
    console.log('News Feed Überschrift gefunden:', await heading.isVisible());

    // 3. Das Suchfeld mit getByPlaceholder() finden
    const searchBox = page.getByPlaceholder('Search news');
    console.log('Suchfeld gefunden:', await searchBox.isVisible());

    // 4. Den Theme-Toggle Button mit getByRole() finden
    const themeToggle = page.getByRole('switch').first(); // Theme toggle is a switch
    console.log('Theme Toggle gefunden:', await themeToggle.isVisible());

    // 5. News-Artikel mit getByRole() finden
    const articles = page.getByRole('article');
    const articleCount = await articles.count();
    console.log(`Anzahl der News-Artikel: ${articleCount}`);

    // 6. Mit getByRole() für Navigation - Navigation ist role="navigation"
    const navigation = page.getByRole('navigation').first(); // Navbar hat navigation role
    console.log('Navigation gefunden:', await navigation.isVisible());

    // 7. Mit getByRole() für ersten Artikel
    if (articleCount > 0) {
      const firstArticle = page.getByRole('article').first();
      console.log('Erster Artikel gefunden:', await firstArticle.isVisible());
    }

    // Hinweis: Dies ist nur zum Üben - normalerweise würden wir assertions verwenden
    // Aber Assertions kommen erst in Übung 4!
  });

  test('Locator-Verkettung üben', async ({ page }) => {
    // Navigiere zur News-Seite für Artikel-Tests
    await page.goto('http://localhost:3000/news/public');

    // Warte auf Inhalte
    await page.waitForLoadState('networkidle');

    // Locators können verkettet werden für präzisere Auswahl
    const mainContent = page.getByRole('main').first(); // Es gibt zwei main Elemente, nimm das erste
    console.log('Main Content gefunden:', await mainContent.isVisible());

    // Filter und Pseudo-Selektoren mit getByRole für Artikel
    const articles = page.getByRole('article');
    const articleCount = await articles.count();
    console.log(`Anzahl der Artikel gefunden: ${articleCount}`);

    if (articleCount > 0) {
      const firstNewsItem = page.getByRole('article').first();
      console.log(
        'Erstes News-Item gefunden:',
        await firstNewsItem.isVisible(),
      );

      const lastNewsItem = page.getByRole('article').last();
      console.log(
        'Letztes News-Item gefunden:',
        await lastNewsItem.isVisible(),
      );

      // Mit Filter arbeiten - suche nach beliebigem Text da "Playwright" möglicherweise nicht vorhanden
      const firstArticleText = await firstNewsItem.textContent();
      const searchTerm = firstArticleText?.split(' ')[0] || 'News';
      const filteredItems = page
        .getByRole('article')
        .filter({ hasText: searchTerm });
      const filteredCount = await filteredItems.count();
      console.log(`Artikel mit "${searchTerm}": ${filteredCount}`);
    }
  });
});
