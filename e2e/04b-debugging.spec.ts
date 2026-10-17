import { test, expect } from '@playwright/test';

test('Kategorie Business filtert die News', async ({ page }) => {
  await page.goto('/news/public');
  // Fehler 1: count() wartet nicht, toHaveCount() schon
  await expect(page.getByRole('article')).toHaveCount(20);

  // Fehler 2: der Name kommt aus dem aria-label des Feldes
  await page
    .getByRole('combobox', { name: 'Filter news by category' })
    .selectOption('Business');

  // Fehler 3: strict mode – erst auf einen Artikel eingrenzen
  await expect(page.getByRole('article')).toHaveCount(5);
  await expect(
    page.getByRole('article').first().getByRole('heading'),
  ).toContainText('Market');
});
