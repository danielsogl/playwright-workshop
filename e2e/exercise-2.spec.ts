import { test, expect } from '@playwright/test';

test.describe('News Feed Filter & Suche', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/news/public');
  });

  test('zeigt News-Items an', async ({ page }) => {
    const newsGrid = page.getByRole('list', { name: 'News articles' });
    await expect(newsGrid).toBeVisible();
    await expect(newsGrid.getByRole('listitem')).toHaveCount(65);
  });

  test('filtert News per Suchfeld', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search news' });
    const newsGrid = page.getByRole('list', { name: 'News articles' });

    await searchInput.fill('Foo');
    await expect(newsGrid.getByRole('listitem')).toHaveCount(0);

    await searchInput.fill('Revelo');
    await expect(newsGrid.getByRole('listitem')).toHaveCount(1);

    await searchInput.fill('');
    await expect(newsGrid.getByRole('listitem')).toHaveCount(65);
  });

  test('filtert News per Kategorie', async ({ page }) => {
    const categorySelect = page.getByLabel('Filter news by category');
    const newsGrid = page.getByRole('list', { name: 'News articles' });

    await categorySelect.selectOption({ label: 'Technology' });
    await expect(newsGrid.getByRole('listitem')).toHaveCount(40);
    await expect(newsGrid.getByRole('listitem').first()).toContainText(
      /Technology/i,
    );

    await categorySelect.selectOption({ label: 'All Categories' });
    await expect(newsGrid.getByRole('listitem')).toHaveCount(65);
  });
});
