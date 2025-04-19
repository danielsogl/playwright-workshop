# Lösung: Übung 2 – Filtertest im News Feed

## 1. Testdatei anlegen oder erweitern
Lege im Verzeichnis `e2e/news/` die Datei `news-feed.spec.ts` an.

## 2. Beispieltest für Suche und Filter
```typescript
import { test, expect } from '@playwright/test';

test('Filter- und Suchfunktion im News Feed', async ({ page }) => {
  await page.goto('/news/public');
  await expect(page.getByRole('list')).toBeVisible();

  // --- Suchfunktion testen ---
  const searchBox = page.getByRole('textbox', { name: /search/i });
  await searchBox.fill('Tech');
  // Warte, bis die gefilterten Artikel erscheinen
  const articles = page.getByRole('listitem');
  await expect(articles).toHaveCountGreaterThan(0);
  await expect(articles.first()).toContainText(/tech/i);

  // Suchfeld leeren
  await searchBox.fill('');
  // Prüfen, ob wieder mehr Artikel erscheinen
  await expect(articles).toHaveCountGreaterThan(1);

  // --- Kategorie-Filter testen ---
  const categoryDropdown = page.getByRole('combobox', { name: /category/i });
  await categoryDropdown.selectOption({ label: 'Technology' });
  // Prüfen, ob alle Artikel die Kategorie enthalten
  const techArticles = page.getByRole('listitem');
  await expect(techArticles.first()).toContainText(/technology/i);

  // Zurück zu "All Categories"
  await categoryDropdown.selectOption({ label: 'All Categories' });
  await expect(articles).toHaveCountGreaterThan(1);
});
```

## 3. Trace-Aufzeichnung aktivieren
In `playwright.config.ts`:
```typescript
use: {
  trace: 'on',
  // ...weitere Optionen
},
```

## 4. Test ausführen und Report öffnen
```bash
npx playwright test
echo "npx playwright show-report" # Report anzeigen
```

---
**Hinweise & Best Practices:**
- Nutze semantische Selektoren (`getByRole`, `getByPlaceholder`) für robuste Tests.
- Prüfe, ob die Filterung korrekt funktioniert, indem du die Inhalte der Artikel validierst.
- Die Trace-Aufzeichnung hilft beim Debugging und der Analyse von Testläufen.
- Testdateien immer in `e2e/<domain>/` ablegen.
