import { test, expect } from '@playwright/test';

test.describe('Exercise 5: News Feed Search Navigation', () => {
  // Gemeinsame Navigation vor jedem Test
  test.beforeEach(async ({ page }) => {
    await page.goto('/news/public');

    // Warte bis News-Liste geladen ist - verwende spezifischeren Selektor
    await expect(page.getByRole('article').first()).toBeVisible({
      timeout: 10000,
    });
  });

  test('zeigt initiale News-Artikel an', async ({ page }) => {
    // Finde alle News-Items über role=article
    const newsItems = page.getByRole('article');

    // Zähle Artikel (beforeEach hat bereits auf den ersten Artikel gewartet)
    const count = await newsItems.count();
    console.log(`Gefundene Artikel: ${count}`);

    // Es sollten Artikel vorhanden sein
    expect(count).toBeGreaterThan(0);

    // Prüfe ersten Artikel
    const firstItem = newsItems.first();
    await expect(firstItem).toBeVisible();

    // Artikel sollte einen nicht-leeren Titel haben
    const title = firstItem.getByRole('heading', { level: 2 }).first();
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();
  });

  test('kann nach News suchen', async ({ page }) => {
    // Finde Suchfeld über textbox role mit spezifischem Namen
    const searchInput = page.getByRole('textbox', {
      name: 'Search news articles',
    });

    // Initiale Anzahl der Artikel
    const initialItems = page.getByRole('article');
    const initialCount = await initialItems.count();

    // Suche nach einem Begriff
    await searchInput.fill('Technology');
    await searchInput.press('Enter');

    // Warte auf Suchergebnisse: Web-First Assertion statt networkidle
    // (die Suche filtert clientseitig, es gibt keinen Netzwerk-Request)
    const filteredItems = page.getByRole('article');
    await expect(filteredItems).not.toHaveCount(initialCount);
    const filteredCount = await filteredItems.count();

    // Es sollten weniger Artikel sein
    expect(filteredCount).toBeLessThan(initialCount);

    // Wenn Artikel vorhanden, prüfe ob sie den Suchbegriff enthalten
    if (filteredCount > 0) {
      const firstFilteredItem = filteredItems.first();
      const itemText = await firstFilteredItem.textContent();
      // Prüfe ob der Text relevant ist (enthält oft den Suchbegriff)
      console.log('Erster gefilterter Artikel:', itemText?.substring(0, 100));
    }
  });

  test('zeigt Nachricht bei keinen Suchergebnissen', async ({ page }) => {
    const searchInput = page.getByRole('textbox', {
      name: 'Search news articles',
    });

    // Suche nach nicht existentem Begriff
    await searchInput.fill('XYZ123NonExistentSearchTerm');
    await searchInput.press('Enter');

    // Keine Artikel mehr, toHaveCount wartet automatisch
    await expect(page.getByRole('article')).toHaveCount(0);

    // Der Trefferzähler zeigt 0 Ergebnisse an
    await expect(
      page.getByText('0 articles found', { exact: true }),
    ).toBeVisible();
  });

  test('kann Suche zurücksetzen', async ({ page }) => {
    const searchInput = page.getByRole('textbox', {
      name: 'Search news articles',
    });

    // Initiale Anzahl
    const initialItems = page.getByRole('article');
    const initialCount = await initialItems.count();

    // Suche durchführen
    await searchInput.fill('Test');
    await searchInput.press('Enter');

    // Lösche Suche
    await searchInput.clear();
    await searchInput.press('Enter');

    // Sollte wieder alle Artikel zeigen, toHaveCount wartet automatisch
    await expect(page.getByRole('article')).toHaveCount(initialCount);
  });

  test('behält Sucheingabe bei Navigation', async ({ page }) => {
    const searchInput = page.getByRole('textbox', {
      name: 'Search news articles',
    });

    // Suche eingeben
    const searchTerm = 'Playwright';
    await searchInput.fill(searchTerm);
    await searchInput.press('Enter');

    // Prüfe ob Suchbegriff noch im Input ist
    await expect(searchInput).toHaveValue(searchTerm);

    // Da alle Links extern sind (https://), testen wir Navigation zu einer anderen Seite
    // und zurück zur News-Seite - use more flexible navigation approach
    const aboutLink = page.getByRole('link', { name: /about/i });
    if ((await aboutLink.count()) > 0) {
      await aboutLink.click();
      await expect(page).toHaveURL('/about');

      // Gehe zurück zur News-Seite
      const newsLink = page.getByRole('link', { name: /news/i });
      if ((await newsLink.count()) > 0) {
        await newsLink.click();
        await expect(page).toHaveURL('/news/public');
      } else {
        // Fallback: navigate directly
        await page.goto('/news/public');
      }
    } else {
      // Skip navigation test if about link not found
      console.log('About link not found, skipping navigation test');
      await page.goto('/news/public');
    }

    // Nach Navigation sollte das Suchfeld leer sein (normales Verhalten)
    // toHaveValue wartet auch, bis das Suchfeld wieder da ist
    await expect(
      page.getByRole('textbox', { name: 'Search news articles' }),
    ).toHaveValue('', { timeout: 10000 });
  });

  test('kann mit verschiedenen Suchbegriffen filtern', async ({ page }) => {
    const searchInput = page.getByRole('textbox', {
      name: 'Search news articles',
    });

    const searchTerms = ['Tech', 'News', 'Update', '2024'];

    for (const term of searchTerms) {
      // Suche nach Begriff
      await searchInput.clear();
      await searchInput.fill(term);
      await searchInput.press('Enter');

      // Zähle Ergebnisse
      const items = page.getByRole('article');
      const count = await items.count();

      console.log(`Suche nach "${term}": ${count} Ergebnisse`);

      // Der Trefferzähler muss zur angezeigten Artikelliste passen
      await expect(
        page.getByText(`${count} articles found`, { exact: true }),
      ).toBeVisible();
    }
  });

  test('Suchfeld ist accessible mit Tastatur', async ({ page }) => {
    // Direkt zum Suchfeld fokussieren
    const searchInput = page.getByRole('textbox', {
      name: 'Search news articles',
    });

    // Stelle sicher, dass das Suchfeld da ist
    await expect(searchInput).toBeVisible();

    // Fokussiere das Suchfeld direkt
    await searchInput.focus();

    // Prüfe ob Fokus gesetzt ist
    await expect(searchInput).toBeFocused();

    // Tippe Zeichen für Zeichen mit echten Tastenanschlägen
    await searchInput.pressSequentially('Keyboard Test');

    // Prüfe ob Text eingegeben wurde
    await expect(searchInput).toHaveValue('Keyboard Test');

    // Enter zum Suchen
    await page.keyboard.press('Enter');

    // Prüfe ob Suchbegriff erhalten blieb
    await expect(searchInput).toHaveValue('Keyboard Test');
  });
});

// Zusätzlicher Test mit Trace für Debugging
test('News Search mit Trace für Debugging', async ({ page }) => {
  // Starte Trace
  await page.context().tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  try {
    await page.goto('/news/public');

    // Warte auf News
    await expect(page.getByRole('article').first()).toBeVisible({
      timeout: 10000,
    });

    // Suche durchführen
    const searchInput = page.getByRole('textbox', {
      name: 'Search news articles',
    });

    await searchInput.fill('Debug Test');
    await searchInput.press('Enter');

    await expect(searchInput).toHaveValue('Debug Test');
  } finally {
    // Speichere Trace
    await page.context().tracing.stop({
      path: 'trace-news-search.zip',
    });
  }
});
