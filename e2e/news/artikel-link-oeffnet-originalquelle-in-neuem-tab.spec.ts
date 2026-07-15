// spec: specs/news-public.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

import { PublicNewsPage } from '../pom/public-news.pom';

test.describe('Happy Path & Artikel-Darstellung', () => {
  test('Artikel-Link öffnet Originalquelle in neuem Tab', async ({ page }) => {
    // 1. Navigiere zu /news/public und warte auf den ersten Artikel
    const newsPage = new PublicNewsPage(page);

    await newsPage.navigateTo();

    const firstArticle = newsPage.items().first();

    await expect(firstArticle).toBeVisible();

    // 2. Lies href, target und rel des Titel-Links der ersten Karte aus
    const titleLink = newsPage.item(0).root.getByRole('link');
    const href = await titleLink.getAttribute('href');

    expect(href).toMatch(/^https?:\/\//);
    expect(new URL(href!).hostname).not.toBe(new URL(page.url()).hostname);
    await expect(titleLink).toHaveAttribute('target', '_blank');

    const rel = await titleLink.getAttribute('rel');

    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');

    // 3. Klicke auf den Titel-Link und fange das neue Tab-Event ab (page.waitForEvent('popup'))
    const popupPromise = page.waitForEvent('popup');

    await titleLink.click();

    const popup = await popupPromise;

    await expect(popup).toHaveURL(href!);
    await popup.close();

    await expect(page).toHaveURL(/\/news\/public$/);
    await expect(page.getByRole('heading', { name: 'News Feed' })).toBeVisible();
  });
});
