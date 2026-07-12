/**
 * Exercise 17 – Capstone
 *
 * Kein neuer Stoff: dieser Test führt die Trägerartefakte des roten Fadens zu
 * einem realistischen End-to-End-Flow zusammen:
 *   - Auth-Fixture (Übung 8, nutzt den API-Login aus Übung 7)
 *   - NewsPage-POM (Übung 9)
 *   - Assertions & Locators (Übungen 4–6)
 *
 * Flow: Login → Public-News (Suche + Kategorie-Filter) → Private-Feeds
 *       (anlegen/auswählen/löschen) → Settings (Name ändern, Session-Update)
 *       → Logout.
 */

import { test, expect } from './fixtures/auth.fixture';
import { NewsPage } from '../pages/NewsPage';

test.describe('Exercise 17: Capstone – kompletter User-Flow', () => {
  test('Login → Public-News → Private-Feeds → Settings → Logout', async ({
    authenticatedPage: page,
  }) => {
    // 1) Bereits eingeloggt über die authenticatedPage-Fixture (Übung 8).

    // 2) Public-News: Suche + Kategorie-Filter über die NewsPage-POM (Übung 9).
    const newsPage = new NewsPage(page);
    await newsPage.goto();

    // Offline-Feed: 20 Artikel (Technology 10, Business 5, World News 5).
    await expect(newsPage.resultsCount).toContainText('20 articles found');
    await expect(newsPage.newsFeed.getByRole('article')).toHaveCount(20);

    // Suche ohne Treffer → deterministisch 0, danach Reset auf 20.
    await newsPage.searchNews('zzz-kein-treffer-xyz');
    await expect(newsPage.newsFeed.getByRole('article')).toHaveCount(0);
    await newsPage.clearSearch();
    await expect(newsPage.newsFeed.getByRole('article')).toHaveCount(20);

    // Kategorie-Filter → deterministisch 5 (Business).
    await newsPage.filterByCategory('Business');
    await expect(newsPage.resultsCount).toContainText('5 articles found');
    await expect(newsPage.newsFeed.getByRole('article')).toHaveCount(5);

    // 3) Private-Feeds: anlegen → auswählen → Count prüfen → löschen.
    await page.goto('/news/private');
    await expect(
      page.getByRole('heading', { name: 'Your Private News Feeds' }),
    ).toBeVisible();

    // Eindeutiger Name, damit parallele/wiederholte Läufe nicht kollidieren.
    const feedName = `Capstone Feed ${Date.now()}`;

    // pressSequentially statt fill – react-aria-Felder setzen den State in
    // WebKit sonst nicht zuverlässig (siehe Übung 8).
    await page
      .getByRole('textbox', { name: 'Name for the new feed' })
      .pressSequentially(feedName);
    await page
      .getByRole('textbox', { name: 'URL for the new feed' })
      .pressSequentially('https://example.com/rss.xml');
    await page
      .getByRole('textbox', { name: 'Optional category for the new feed' })
      .pressSequentially('Tech');
    await page.getByRole('button', { name: 'Add new feed' }).click();

    const selectFeedButton = page.getByRole('button', {
      name: `Select feed: ${feedName}`,
    });
    await expect(selectFeedButton).toBeVisible();

    // Der Count-Chip im Feed-Header spiegelt die Anzahl der Feed-Einträge.
    const feedsRegion = page.getByRole('list', { name: 'Your RSS feeds' });
    const feedItems = feedsRegion.getByRole('listitem');
    const countAfterAdd = await feedItems.count();
    expect(countAfterAdd).toBeGreaterThan(0);

    // Feed auswählen …
    await selectFeedButton.click();

    // … und wieder löschen.
    await page
      .getByRole('button', { name: `Delete feed: ${feedName}` })
      .click();
    await expect(selectFeedButton).toBeHidden();
    await expect(feedItems).toHaveCount(countAfterAdd - 1);

    // 4) Settings: Name ändern → Success-Banner UND Navbar-Initialen prüfen
    //    (Session-`update`, cross-component).
    await page.goto('/settings');
    const nameInput = page.getByRole('textbox', { name: 'Your name' });
    await expect(nameInput).toBeVisible();

    await nameInput.click();
    await nameInput.press('ControlOrMeta+a');
    await nameInput.press('Delete');
    await nameInput.pressSequentially('Capstone Tester');

    await page.getByRole('button', { name: 'Submit profile update' }).click();

    // Success-Banner …
    await expect(
      page.getByText('Profile updated successfully!'),
    ).toBeVisible();

    // … und die Navbar-Initialen aktualisieren sich über das Session-Update.
    const userMenu = page.getByRole('button', {
      name: 'User profile actions menu',
    });
    await expect(userMenu).toContainText('CT');

    // 5) Logout über das Navbar-Dropdown → Login-Zustand ist weg.
    await userMenu.click();
    await page.getByRole('menuitem', { name: /log out/i }).click();

    await expect(
      page.getByRole('link', { name: 'Sign in to your account' }),
    ).toBeVisible();
  });
});
