// spec: specs/news-public.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

import { PublicNewsPage } from '../pom/public-news.pom';

test.describe('Happy Path & Artikel-Darstellung', () => {
  test('Seite lädt und zeigt News-Artikel an', async ({ page }) => {
    const newsPage = new PublicNewsPage(page);

    // 1. Navigiere zu /news/public (frischer Kontext, kein Login)
    await newsPage.navigateTo();

    await expect(page.getByRole('heading', { name: 'News Feed' })).toBeVisible();
    await expect(page.getByText('Browse the latest news from public RSS feeds')).toBeVisible();
    await expect(newsPage.loading).toBeHidden();

    // 2. Warte bis das Artikel-Grid (role=feed, 'News articles') geladen ist
    const articles = newsPage.items();

    await expect(articles.first()).toBeVisible();

    const articleCount = await articles.count();

    expect(articleCount).toBeGreaterThan(0);
    expect(await newsPage.resultsText()).toBe(`${articleCount} articles found`);

    // 3. Prüfe den Aufbau der ersten Artikelkarte
    const firstItem = newsPage.item(0);

    await expect(firstItem.root.locator('[data-slot="chip"], .chip').first()).toBeVisible();

    const titleHeading = firstItem.root.getByRole('heading', { level: 2 });

    await expect(titleHeading).toBeVisible();
    expect((await firstItem.title()).length).toBeGreaterThan(0);

    await expect(firstItem.root.locator('p')).toBeVisible();
    expect((await firstItem.descriptionText()).length).toBeGreaterThan(0);

    const dateText = (await firstItem.root.locator('.text-xs').innerText()).trim();

    expect(dateText === 'Date unavailable' || /^\d{1,2}\.\s\S+\s\d{4}$/.test(dateText)).toBeTruthy();
  });
});
