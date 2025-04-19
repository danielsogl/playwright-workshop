# Lösung: Übung 5 – API Mocking

## Hinweise zur Codebasis
- Testdateien für API-Mocking liegen in `e2e/news/news-feed.spec.ts` oder `e2e/news/api-mocking.spec.ts`.
- Verwende Playwrights `page.route()` und `route.fulfill()` zum Mocken von API-Requests.
- Nutze ausschließlich semantische Selektoren und die `baseURL` aus der Konfiguration.

## Beispiel für API-Mocking-Tests (`e2e/news/api-mocking.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';

test('zeigt gemockte News-Artikel', async ({ page }) => {
  await page.route('**/api/news/public', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items: [
        { title: 'Mock News 1', category: 'Tech', description: 'Desc 1' },
        { title: 'Mock News 2', category: 'Business', description: 'Desc 2' }
      ] })
    });
  });
  await page.goto('/news/public');
  await expect(page.getByRole('listitem')).toHaveCount(2);
  await expect(page.getByRole('heading', { name: 'Mock News 1' })).toBeVisible();
});

test('zeigt Fehlermeldung bei API-Fehler', async ({ page }) => {
  await page.route('**/api/news/public', route => route.fulfill({ status: 500 }));
  await page.goto('/news/public');
  await expect(page.getByRole('alert')).toBeVisible();
});

test('zeigt "Keine Daten gefunden" bei leerer Antwort', async ({ page }) => {
  await page.route('**/api/news/public', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ items: [] })
  }));
  await page.goto('/news/public');
  await expect(page.getByText(/keine daten gefunden/i)).toBeVisible();
});

test('zeigt Ladeindikator bei langsamer API', async ({ page }) => {
  await page.route('**/api/news/public', async route => {
    await new Promise(res => setTimeout(res, 2000));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items: [
        { title: 'Delayed News', category: 'Tech', description: 'Desc' }
      ] })
    });
  });
  await page.goto('/news/public');
  await expect(page.getByRole('status', { name: /loading/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Delayed News' })).toBeVisible();
});
```

---
**Best Practices:**
- Testdateien nach Domain in `e2e/<domain>/` ablegen.
- Mocke APIs mit `page.route()` und `route.fulfill()`.
- Simuliere verschiedene Szenarien (Erfolg, Fehler, leer, langsam).
- Nutze semantische Selektoren für Assertions.
