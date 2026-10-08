/* eslint-disable playwright/expect-expect -- Übung 2 übt bewusst nur das Finden, Assertions folgen in Übung 4 */
import { test } from '@playwright/test';

test.describe('Übung 2 - Locators kennenlernen', () => {
  test('Startseite: drei Locators', async ({ page }) => {
    await page.goto('/');

    // Aufgabe 1: Rolle + Name, sichtbarer Text, Label
    const publicNewsLink = page.getByRole('link', {
      name: /view public news/i,
    });
    console.log('Public News Link:', await publicNewsLink.count());

    const welcome = page.getByText('Welcome to');
    console.log('Welcome-Text sichtbar:', await welcome.isVisible());

    // Den Umschalter gibt es für Desktop und Mobile, visible() nimmt den sichtbaren
    const themeToggle = page
      .getByLabel(/switch to (dark|light) mode/i)
      .visible();
    console.log('Theme-Umschalter sichtbar:', await themeToggle.isVisible());

    // Aufgabe 4: describe() ersetzt in Log, Trace und Report die Selektor-Darstellung
    console.log(publicNewsLink.describe('Link zu den Public News'));
  });

  test('News-Seite: vier Locators', async ({ page }) => {
    await page.goto('/news/public');

    const heading = page.getByText('News Feed', { exact: true });
    console.log('Überschrift sichtbar:', await heading.isVisible());

    const searchBox = page.getByPlaceholder('Search news');
    console.log('Suchfeld sichtbar:', await searchBox.isVisible());

    // count() wartet nicht: erst auf den ersten Artikel warten
    const articles = page.getByRole('article');
    await articles.first().waitFor();
    console.log('Anzahl Artikel:', await articles.count());

    // Verkettung: Überschrift im ersten Artikel
    const firstTitle = await articles
      .first()
      .getByRole('heading')
      .textContent();
    console.log('Titel des ersten Artikels:', firstTitle);

    // Bonus A: Filter mit dem ersten Wort des ersten Artikels
    const searchTerm = firstTitle?.split(' ')[0] ?? 'News';
    const filtered = articles.filter({ hasText: searchTerm });
    console.log(`Artikel mit "${searchTerm}":`, await filtered.count());
  });
});
